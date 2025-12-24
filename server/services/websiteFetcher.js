import axios from "axios";

export async function fetchWebsiteData(url) {
  try {
    console.log(`Fetching website data from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    console.log(`Successfully fetched data. Status: ${response.status}`);

    // Log the fetched HTML content (for debugging)
    console.log("Fetched HTML content:", response.data);

    return {
      success: true,
      htmlContent: response.data,
      status: response.status,
      finalUrl: response.request.res.responseUrl || url,
    };
  } catch (error) {
    console.error("[STEP 1] Error fetching website:", error);
    throw new Error(`Failed to fetch website: ${error}`);
  }
}
