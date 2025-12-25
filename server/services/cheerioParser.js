import * as cheerio from "cheerio";

export function parseRawHtml(htmlContent) {
  try {
    console.log("[STEP 2A] Parsing raw HTML data...");
    const $ = cheerio.load(htmlContent);

    // Extract all meaningful data
    const structuredData = {
      title: $("title").text().trim() || "No title",

      meta: {
        description: $('meta[name="description"]').attr("content") || "",
        keywords: $('meta[name="keywords"]').attr("content") || "",
        viewport: $('meta[name="viewport"]').attr("content") || "",
        ogTitle: $('meta[property="og:title"]').attr("content") || "",
        ogDescription:
          $('meta[property="og:description"]').attr("content") || "",
        charset:
          $("meta[charset]").attr("charset") ||
          $('meta[http-equiv="Content-Type"]').attr("content") ||
          "",
      },

      headings: {
        h1: $("h1")
          .map((i, el) => $(el).text().trim())
          .get(),
        h2: $("h2")
          .map((i, el) => $(el).text().trim())
          .get(),
        h3: $("h3")
          .map((i, el) => $(el).text().trim())
          .get(),
        h4: $("h4")
          .map((i, el) => $(el).text().trim())
          .get(),
        h5: $("h5")
          .map((i, el) => $(el).text().trim())
          .get(),
        h6: $("h6")
          .map((i, el) => $(el).text().trim())
          .get(),
      },

      semanticElements: {
        header: $("header").length,
        nav: $("nav").length,
        main: $("main").length,
        article: $("article").length,
        section: $("section").length,
        aside: $("aside").length,
        footer: $("footer").length,
        figure: $("figure").length,
        figcaption: $("figcaption").length,
      },

      content: {
        paragraphs: $("p").length,
        lists: $("ul, ol").length,
        tables: $("table").length,
        forms: $("form").length,
      },

      links: {
        total: $("a").length,
        internal: $('a[href^="/"], a[href^="#"]').length,
        external: $('a[href^="http"]').length,
        withoutHref: $("a:not([href])").length,
      },

      images: {
        total: $("img").length,
        withAlt: $("img[alt]").length,
        withoutAlt: $('img:not([alt]), img[alt=""]').length,
        lazyLoaded: $('img[loading="lazy"]').length,
      },

      scripts: {
        total: $("script").length,
        external: $("script[src]").length,
        inline: $("script:not([src])").length,
        async: $("script[async]").length,
        defer: $("script[defer]").length,
      },

      styles: {
        external: $('link[rel="stylesheet"]').length,
        inline: $("style").length,
      },

      accessibility: {
        ariaLabels: $("[aria-label]").length,
        ariaDescribedBy: $("[aria-describedby]").length,
        ariaLabelledBy: $("[aria-labelledby]").length,
        ariaHidden: $("[aria-hidden]").length,
        roles: $("[role]").length,
        langAttribute: $("html[lang]").length > 0,
      },

      structure: {
        divs: $("div").length,
        spans: $("span").length,
        totalElements: $("*").length,
        maxNestingDepth: calculateMaxDepth($),
      },
    };

    console.log("[STEP 2A] ✓ Raw data parsed successfully");
    console.log(
      "[STEP 2A] Extracted Data:",
      JSON.stringify(structuredData, null, 2)
    );

    return structuredData;
  } catch (error) {
    console.error("[STEP 2A] Error parsing raw data:", error.message);
    throw new Error(`Raw data parsing failed: ${error.message}`);
  }
}

// Calculate maximum nesting depth
function calculateMaxDepth($) {
  let maxDepth = 0;
  $("*").each((i, el) => {
    let depth = $(el).parents().length;
    if (depth > maxDepth) maxDepth = depth;
  });
  return maxDepth;
}
