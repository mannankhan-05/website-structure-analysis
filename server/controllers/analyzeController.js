import { fetchWebsiteData } from "../services/websiteFetcher.js";
import { parseRawHtml } from "../services/cheerioParser.js";
import { parseDataWithAI } from "../services/aiParser.js";

export async function analyzeWebsite(req, res) {
  const startTime = Date.now();

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required in request body",
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format. Please provide a valid HTTP/HTTPS URL",
      });
    }

    console.log("\n========================================");
    console.log("Starting Website Analysis");
    console.log("========================================");

    // STEP 1: Fetch website data
    const fetchResult = await fetchWebsiteData(url);

    // STEP 2: Parse raw HTML
    const parsedHtml = parseRawHtml(fetchResult.htmlContent);

    // STEP 3 : Parse data with AI
    const parseResult = await parseDataWithAI(parsedHtml, fetchResult.finalUrl);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    console.log("========================================");
    console.log(`Analysis completed in ${processingTime}ms`);
    console.log("========================================\n");

    // Send successful response
    return res.status(200).json({
      success: true,
      url: fetchResult.finalUrl,
      analysis: parseResult.parsedData,
      metadata: {
        model: parseResult.model,
        tokensUsed: parseResult.tokensUsed,
        processingTimeMs: processingTime,
      },
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze website",
    });
  }
}
