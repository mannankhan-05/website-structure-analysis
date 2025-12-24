import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function parseDataWithAI(htmlContent, url) {
  try {
    console.log("Parsing data with OpenRouter AI...");

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not found in environment variables");
    }

    // Truncate HTML if too large (keep first 8000 chars for context)
    const truncatedHtml =
      htmlContent.length > 8000
        ? htmlContent.substring(0, 8000) + "...[truncated]"
        : htmlContent;

    const prompt = `
You are analyzing the STRUCTURAL QUALITY of a website for machine readability.

URL: ${url}

HTML (truncated):
${truncatedHtml}

Analyze the website based ONLY on:
- HTML semantics
- Structural organization
- Machine readability
- Semantic clarity

Return a VALID JSON object with the following structure:

{
    "overall_structure_score": number (0-100),
  "summary": {
    "overall_assessment": string,
    "primary_strengths": string[],
    "primary_weaknesses": string[]
  },
  "semantic_markup": {
    "semantic_elements_used": string[],
    "semantic_quality": "excellent" | "good" | "moderate" | "poor",
    "issues": string[]
  },
  "dom_structure": {
    "hierarchy_clarity": "clear" | "moderate" | "unclear",
    "nesting_quality": "good" | "moderate" | "poor",
    "issues": string[]
  },
  "content_organization": {
    "heading_hierarchy_quality": "good" | "moderate" | "poor",
    "content_grouping_assessment": string
  },
  "metadata": {
    "meta_quality": "good" | "partial" | "missing",
    "issues": string[]
  },
  "script_dependency": {
    "dependency_level": "low" | "moderate" | "high",
    "rendering_risk": string
  },
  "accessibility_signals": {
    "aria_usage": "good" | "minimal" | "missing",
    "alt_text_quality": "good" | "partial" | "missing"
  },
  "recommendations": [
    {
      "category": string,
      "recommendation": string,
      "impact": "high" | "medium" | "low"
    }
  ]
}

DO NOT include scores.
DO NOT include SEO analysis.
DO NOT include anything outside JSON.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-exp:free", // Free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Website Structure Analyzer",
        },
        timeout: 30000,
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    console.log("AI parsing completed");

    // Try to parse JSON from AI response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      parsedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      // If JSON parsing fails, return raw response
      parsedData = {
        rawAnalysis: aiResponse,
        note: "AI response was not in JSON format",
      };
    }

    return {
      success: true,
      parsedData,
      model: response.data.model,
      tokensUsed: response.data.usage,
    };
  } catch (error) {
    console.error("Error parsing with AI:", error.message);
    throw new Error(`AI parsing failed: ${error.message}`);
  }
}
