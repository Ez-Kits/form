import fs from "fs";
import MarkdownIt from "markdown-it";
import MiniSearch from "minisearch";
import pMap from "p-map";
import path from "path";
import { ViteDevServer } from "vite";
import {
	DefaultTheme,
	MarkdownEnv,
	Plugin,
	ResolvedRouteConfig,
	SiteConfig,
	SiteData,
	createMarkdownRenderer,
} from "vitepress";
import { processIncludes } from "./processIncludes";
import { isActive, isExternal, slash } from "./utils";

interface IndexObject {
	id: string;
	text: string;
	title: string;
	titles: string[];
}

export interface LocalSearchOptions {
	computeTitles?: (id: string, titles: string[]) => string[];
}

const LOCAL_SEARCH_INDEX_ID = "@localSearchIndex";
const LOCAL_SEARCH_INDEX_REQUEST_PATH = "/" + LOCAL_SEARCH_INDEX_ID;

export default function localSearch({
	computeTitles,
}: LocalSearchOptions): Plugin[] {
	let siteConfig: SiteConfig<DefaultTheme.Config>;
	let options: DefaultTheme.LocalSearchOptions;
	let server: ViteDevServer | undefined;
	let md: MarkdownIt;

	const indexByLocales = new Map<string, MiniSearch<IndexObject>>();

	async function render(file: string) {
		let md_raw: string;
		let md_src: string;
		let env: MarkdownEnv;
		const { srcDir, cleanUrls = false } = siteConfig;
		if (fs.existsSync(file)) {
			const relativePath = slash(path.relative(srcDir, file));
			env = { path: file, relativePath, cleanUrls };
			md_raw = await fs.promises.readFile(file, "utf-8");
			md_src = processIncludes(srcDir, md_raw, file, []);
		} else if (
			siteConfig.dynamicRoutes.routes.findIndex(
				({ fullPath }) => fullPath === file
			) > -1
		) {
			const route = siteConfig.dynamicRoutes.routes.find(
				({ fullPath }) => fullPath === file
			) as ResolvedRouteConfig;

			const relativePath = slash(path.relative(srcDir, file));
			env = { path: file, relativePath, cleanUrls };
			md_raw = route.content ?? "";
			md_src = processIncludes(srcDir, md_raw, file, []);
		} else {
			return "";
		}

		if (options._render) {
			return await options._render(md_src, env, md);
		} else {
			const html = md.render(md_src, env);
			return env.frontmatter?.search === false ? "" : html;
		}
	}

	function getIndexByLocale(locale: string) {
		let index = indexByLocales.get(locale);
		if (!index) {
			index = new MiniSearch<IndexObject>({
				fields: ["title", "titles", "text"],
				storeFields: ["title", "titles"],
				...options.miniSearch?.options,
			});
			indexByLocales.set(locale, index);
		}
		return index;
	}

	function getLocaleForPath(
		siteData: SiteData | undefined,
		relativePath: string
	): string {
		return (
			Object.keys(siteData?.locales || {}).find(
				(key) =>
					key !== "root" &&
					!isExternal(key) &&
					isActive(relativePath, `/${key}/`, true)
			) || "root"
		);
	}

	function onIndexUpdated() {
		if (server) {
			server.moduleGraph.onFileChange("/" + LOCAL_SEARCH_INDEX_REQUEST_PATH);
			// HMR
			const mod = server.moduleGraph.getModuleById(
				"/" + LOCAL_SEARCH_INDEX_REQUEST_PATH
			);

			if (!mod) return;
			server.ws.send({
				type: "update",
				updates: [
					{
						acceptedPath: mod.url,
						path: mod.url,
						timestamp: Date.now(),
						type: "js-update",
					},
				],
			});
		}
	}

	function getDocId(file: string) {
		let relFile = slash(path.relative(siteConfig.srcDir, file));
		relFile = siteConfig.rewrites.map[relFile] || relFile;
		let id = slash(path.join(siteConfig.site.base, relFile));
		id = id.replace(/(^|\/)index\.md$/, "$1");
		id = id.replace(/\.md$/, siteConfig.cleanUrls ? "" : ".html");
		return id;
	}

	async function indexFile(page: string) {
		const file = path.join(siteConfig.srcDir, page);
		// get file metadata
		const fileId = getDocId(file);
		const locale = getLocaleForPath(siteConfig.site, page);
		const index = getIndexByLocale(locale);
		// retrieve file and split into "sections"
		const html = await render(file);
		const sections =
			// user provided generator
			(await options.miniSearch?._splitIntoSections?.(file, html)) ??
			// default implementation
			splitPageIntoSections(html);
		// add sections to the locale index
		for await (const section of sections) {
			if (!section || !(section.text || section.titles)) break;
			const { anchor, text, titles } = section;
			const id = anchor ? [fileId, anchor].join("#") : fileId;
			const newTitles = computeTitles ? computeTitles(id, titles) : titles;

			index.add({
				id,
				text,
				title: newTitles.at(-1)!,
				titles: newTitles.slice(0, -1),
			});
		}
	}

	async function scanForBuild() {
		console.info("🔍️ Indexing files for search...");
		await pMap(siteConfig.pages, indexFile, {
			concurrency: siteConfig.buildConcurrency,
		});
		console.info("✅ Indexing finished...");
	}

	return [
		{
			name: "vitepress-plugin-local-search",
			configureServer(viteServer) {
				server = viteServer as unknown as ViteDevServer;
				onIndexUpdated();
			},
			async configResolved(inputConfig: any) {
				siteConfig = inputConfig.vitepress;
				options = siteConfig.site.themeConfig.search?.options || {};

				md = await createMarkdownRenderer(
					siteConfig.srcDir,
					siteConfig.markdown,
					siteConfig.site.base,
					siteConfig.logger
				);
				await scanForBuild();
			},
			async transform(code, id, options) {
				if (id === LOCAL_SEARCH_INDEX_REQUEST_PATH) {
					if (process.env.NODE_ENV === "production") {
						await scanForBuild();
					}
					return;
				}

				if (id.startsWith(LOCAL_SEARCH_INDEX_REQUEST_PATH)) {
					return `export default ${JSON.stringify(
						JSON.stringify(
							indexByLocales.get(
								id.replace(LOCAL_SEARCH_INDEX_REQUEST_PATH, "")
							) ?? {},
							undefined,
							2
						)
					)}`;
				}
			},

			async handleHotUpdate({ modules, file }) {
				onIndexUpdated();
				const module = modules[0];
				if (module && module.file?.endsWith(".md")) {
					await indexFile(module.url);
					console.info("🔍️ Updated", module.url);
				}
			},
		},
	];
}

const headingRegex = /<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi;
const headingContentRegex = /(.*?)<a.*? href="#(.*?)".*?>.*?<\/a>/i;

/**
 * Splits HTML into sections based on headings
 */
function* splitPageIntoSections(html: string) {
	const result = html.split(headingRegex);
	result.shift();
	let parentTitles: string[] = [];
	for (let i = 0; i < result.length; i += 3) {
		const level = parseInt(result[i]) - 1;
		const heading = result[i + 1];
		const headingResult = headingContentRegex.exec(heading);
		const title = clearHtmlTags(headingResult?.[1] ?? "").trim();
		const anchor = headingResult?.[2] ?? "";
		const content = result[i + 2];
		if (!title || !content) continue;
		let titles = parentTitles.slice(0, level);
		titles[level] = title;
		titles = titles.filter(Boolean);
		yield { anchor, titles, text: getSearchableText(content) };
		if (level === 0) {
			parentTitles = [title];
		} else {
			parentTitles[level] = title;
		}
	}
}

function getSearchableText(content: string) {
	content = clearHtmlTags(content);
	return content;
}

function clearHtmlTags(str: string) {
	return str.replace(/<[^>]*>/g, "");
}
