import{_ as a,c as i,aC as e,o as n}from"./chunks/framework.Blpdv6_i.js";const k=JSON.parse('{"title":"Basic Concepts","description":"","frontmatter":{"title":"Basic Concepts"},"headers":[],"params":{"framework":"vue","slug":"guide/basic-concepts"},"relativePath":"vue/guide/basic-concepts.md","filePath":"vue/guide/basic-concepts.md"}'),t={name:"vue/guide/basic-concepts.md"};function l(p,s,r,o,c,d){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="basic-concepts" tabindex="-1">Basic Concepts <a class="header-anchor" href="#basic-concepts" aria-label="Permalink to &quot;Basic Concepts&quot;">​</a></h1><p>This page will introduce some basic concepts in <strong>Ez Form</strong>.</p><h2 id="form-instance" tabindex="-1">Form Instance <a class="header-anchor" href="#form-instance" aria-label="Permalink to &quot;Form Instance&quot;">​</a></h2><p><code>FormInstance</code> is an object that contains the form&#39;s data and methods.</p><p>You can get it from <code>useForm</code>.</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useForm } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@ez-kits/form-vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> form</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useForm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	// form options go here</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 id="field-instance" tabindex="-1">Field Instance <a class="header-anchor" href="#field-instance" aria-label="Permalink to &quot;Field Instance&quot;">​</a></h2><p><code>FieldInstance</code> is an object that contains the field&#39;s data and methods. This is the way to get it.</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useField } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@ez-kits/form-vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> field</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useField</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;username&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>useField</code> injects <code>FormInstance</code>, provided by <code>useForm</code>. So, you have to use <code>useField</code> in component under <code>form.Form</code> or <code>useForm</code>.</p></div><h2 id="field-array-instance" tabindex="-1">Field Array Instance <a class="header-anchor" href="#field-array-instance" aria-label="Permalink to &quot;Field Array Instance&quot;">​</a></h2><p><code>FieldArrayInstance</code> is an object that contains the field array&#39;s data and methods. You can get it just like <code>FieldInstance</code>.</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useFieldArray } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@ez-kits/form-vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> field</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useFieldArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	name: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;list&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>useFieldArray</code> injects <code>FormInstance</code>, provided by <code>useForm</code>. So, you have to use <code>useFieldArray</code> in component under <code>form.Form</code> or <code>useForm</code>.</p></div>`,14)]))}const u=a(t,[["render",l]]);export{k as __pageData,u as default};