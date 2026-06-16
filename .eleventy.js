const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  // Дозволяємо описувати дані сторінок у .yaml (зручніше за JSON для довгого контенту).
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Статичні ассети копіюються як є.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  // Фільтр для безпечної інʼєкції даних сторінки у <script> як JSON.
  eleventyConfig.addFilter("json", (value) =>
    JSON.stringify(value).replace(/</g, "\\u003c")
  );

  // Колекція сторінок хабу: усе, що має блок `hub:` у front-matter.
  // Це єдине джерело правди — окремий маніфест (content.json) більше не потрібен.
  eleventyConfig.addCollection("hubPages", (collectionApi) =>
    collectionApi
      .getAll()
      .filter((item) => item.data.hub)
      .sort((a, b) => (a.data.hub.order || 0) - (b.data.hub.order || 0))
  );

  // Картки однієї секції хабу (Nunjucks не має selectattr/where з Jinja).
  eleventyConfig.addFilter("hubGroup", (pages, groupId) =>
    (pages || [])
      .filter((p) => p.data.hub && p.data.hub.group === groupId)
      .sort((a, b) => (a.data.hub.order || 0) - (b.data.hub.order || 0))
  );

  eleventyConfig.addFilter("anyFeatured", (pages) =>
    (pages || []).some((p) => p.data.hub && p.data.hub.featured)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
