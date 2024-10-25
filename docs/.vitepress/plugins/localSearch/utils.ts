import { HeadConfig, SiteData } from "vitepress";

export const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
export const APPEARANCE_KEY = "vitepress-theme-appearance";

const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;

export const inBrowser = typeof document !== "undefined";

export function slash(p: string): string {
	return p.replace(/\\/g, "/");
}

function normalize(path: string): string {
	return decodeURI(path)
		.replace(HASH_OR_QUERY_RE, "")
		.replace(INDEX_OR_EXT_RE, "$1");
}

export function isActive(
	currentPath: string,
	matchPath?: string,
	asRegex: boolean = false
): boolean {
	if (matchPath === undefined) {
		return false;
	}

	currentPath = normalize(`/${currentPath}`);

	if (asRegex) {
		return new RegExp(matchPath).test(currentPath);
	}

	if (normalize(matchPath) !== currentPath) {
		return false;
	}

	const hashMatch = matchPath.match(HASH_RE);

	if (hashMatch) {
		return (inBrowser ? location.hash : "") === hashMatch[0];
	}

	return true;
}

export function isExternal(path: string): boolean {
	return EXTERNAL_URL_RE.test(path);
}

export function resolveSiteDataByRoute(
	siteData: SiteData,
	relativePath: string
): SiteData {
	const localeIndex =
		Object.keys(siteData.locales).find(
			(key) =>
				key !== "root" &&
				!isExternal(key) &&
				isActive(relativePath, `/${key}/`, true)
		) || "root";

	return Object.assign({}, siteData, {
		localeIndex,
		lang: siteData.locales[localeIndex]?.lang ?? siteData.lang,
		dir: siteData.locales[localeIndex]?.dir ?? siteData.dir,
		title: siteData.locales[localeIndex]?.title ?? siteData.title,
		titleTemplate:
			siteData.locales[localeIndex]?.titleTemplate ?? siteData.titleTemplate,
		description:
			siteData.locales[localeIndex]?.description ?? siteData.description,
		head: mergeHead(siteData.head, siteData.locales[localeIndex]?.head ?? []),
		themeConfig: {
			...siteData.themeConfig,
			...siteData.locales[localeIndex]?.themeConfig,
		},
	});
}

export function mergeHead(prev: HeadConfig[], curr: HeadConfig[]) {
	return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}

function hasTag(head: HeadConfig[], tag: HeadConfig) {
	const [tagType, tagAttrs] = tag;
	if (tagType !== "meta") return false;
	const keyAttr = Object.entries(tagAttrs)[0]; // First key
	if (keyAttr == null) return false;
	return head.some(
		([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]
	);
}
