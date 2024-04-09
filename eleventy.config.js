/****************
 * Filters {{{1 *
 ****************/
// First create variables that require() any packages we need
// const plugin = require('some-eleventy-plugin-package')
const Image = require('@11ty/eleventy-img');
const EleventyFetch = require('@11ty/eleventy-fetch');
const { DateTime } = require('luxon');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');
const path = require('path');
const Pandoc = require('markdown-it-pandoc');
const eleventyCiteproc = require('eleventy-plugin-citeproc');
const htmlmin = require('html-minifier');
const countryEmoji = require('./src/filters/country-emoji.js');
const yaml = require('js-yaml');
const dynamicCategories = require('eleventy-plugin-dynamic-categories');
const pluginRss = require('@11ty/eleventy-plugin-rss');
/********************************
 * eleventyConfig function {{{1 *
 ********************************/
// Use module.exports to export a configuration funcion.
// This is a standard function in Node.js projects
module.exports = function(eleventyConfig) {
  // Run any code needed including built-in 11ty methods
 /*************************
  * Passthrough copy {{{2 *
  *************************/
  // Copy assets/ to _site/assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "node_modules/leaflet/dist": "assets/leaflet" });
	eleventyConfig.addPassthroughCopy({ "node_modules/jquery/dist": "assets/jquery/js" });
	eleventyConfig.addPassthroughCopy({ "node_modules/@knight-lab/timelinejs/dist": "assets/timelinejs" });
	eleventyConfig.addPassthroughCopy("src/.domains");
  eleventyConfig.addPassthroughCopy(".gitattributes");
  // emulate passthrough during --serve:
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
 /*****************
	* Markdown {{{2 *
	*****************/
	eleventyConfig.setLibrary(
		'md',
		require('markdown-it')({
			html: true,
			xhtmlOut: true, // <br /> instead of <br>
			breaks: false, // Single line breaks do not start paragraphs
			linkify: true,
			typographer: true, // https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mj
			quotes: '“”‘’',
			katex: false,
			mathjax: true,
		}).use(require('markdown-it-pandoc'))
	);
 /*************************
  * Activate plugins {{{2 *
  *************************/
	// Call filters defined outside this function
  eleventyConfig.addFilter("dateFilter", (dateObj) => {
    return DateTime.fromJSDate(dateObj).setZone("utc").setLocale('pt').toLocaleString(DateTime.DATE_SHORT);
  });
	eleventyConfig.addFilter('w3DateFilter', w3DateFilter);
  eleventyConfig.addFilter('countryEmoji', countryEmoji);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));
  eleventyConfig.addPlugin(dynamicCategories, {
    categoryVar: "categories",
    itemCollection: "all",
  });
  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: "slash"
    }
  });
  eleventyConfig.addFilter('yamlToJson', (value) => {
    const yaml = require('js-yaml');
    return JSON.stringify(yaml.load(value));
  });
  //eleventyConfig.setQuietMode(true);
	// https://github.com/Myllaume/eleventy-plugin-citeproc/
	/*
	 *eleventyConfig.addPlugin(eleventyCiteproc, {
	 *  bibliographicStylePath: path.join(__dirname, 'assets/biblio/chicago-note-bibliography.csl'),
	 *  bibliographicLocalizationPath: path.join(__dirname, 'assets/biblio/locales-pt-BR.xml'),
	 *  bibliographicDataPath: path.join(__dirname, '_data/biblio.json')
	 *});
	 */
 /********************
  * Setup views {{{2 *
  ********************/
  eleventyConfig.addCollection("obras", function(collection) {
    return collection.getFilteredByGlob("src/civico/*.md");
  });
	eleventyConfig.addCollection('destaques', function(collection) {
    return sortByDisplayOrder(collection.getFilteredByGlob("src/civico/*.md")).filter(
			x => x.data.featured
		);
	});
	// Minify HTML {{{3
	eleventyConfig.addTransform("htmlmin", function(content) {
		// Prior to Eleventy 2.0: use this.outputPath instead
		if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true
			});
			return minified;
		}
		return content;
	});
 /***************
  * Return {{{2 *
  ***************/
  // If needed, return an object configuration
  return {
    dir: {
			htmlTemplateEngine: "njk",
			templateFormats: ["html", "liquid", "njk"],
      input: 'src',
      output: '_site',
      includes: '_includes'
    }
  }
};
// vim: foldmethod=marker shiftwidth=2 tabstop=2
