import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function parseDataWithAI(htmlContent, url) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not found in environment variables");
    }

    console.log("Sending structured data to AI...");

    const prompt = `You are analyzing the STRUCTURAL QUALITY of a website for machine readability.

URL: ${url}

STRUCTURED DATA EXTRACTED FROM HTML:
${JSON.stringify(htmlContent, null, 2)}

Analyze the website based ONLY on:
- HTML semantics
- Structural organization
- Machine readability
- Semantic clarity

Return a VALID JSON object with the following EXACT structure (all fields are REQUIRED):

{
  "overall_structure_score": number (0-100),
  "summary": {
    "overall_assessment": "string describing overall quality",
    "primary_strengths": ["strength 1", "strength 2", "strength 3"],
    "primary_weaknesses": ["weakness 1", "weakness 2", "weakness 3"]
  },
  "semantic_markup": {
    "semantic_elements_used": ["element1", "element2"],
    "semantic_quality": "excellent" | "good" | "moderate" | "poor",
    "issues": ["issue 1", "issue 2"],
    "semantic_markup_score": number (0-100)
  },
  "dom_structure": {
    "hierarchy_clarity": "clear" | "moderate" | "unclear",
    "nesting_quality": "good" | "moderate" | "poor",
    "issues": ["issue 1", "issue 2"],
    "dom_structure_score": number (0-100)
  },
  "content_organization": {
    "heading_hierarchy_quality": "good" | "moderate" | "poor",
    "content_grouping_assessment": "string assessment",
    "content_organization_score": number (0-100)
  },
  "metadata": {
    "meta_quality": "good" | "partial" | "missing",
    "issues": ["issue 1", "issue 2"],
    "meta_quality_score": number (0-100)
  },
  "script_dependency": {
    "dependency_level": "low" | "moderate" | "high",
    "rendering_risk": "string explaining risk",
    "script_dependency_score": number (0-100)
  },
  "accessibility_signals": {
    "aria_usage": "good" | "minimal" | "missing",
    "alt_text_quality": "good" | "partial" | "missing",
    "accessibility_score": number (0-100)
  },
  "recommendations": [
    {
      "category": "string",
      "recommendation": "string",
      "impact": "high" | "medium" | "low"
    }
  ],
   "page_structure_schema": {
    "current_structure": {
      "description": "string summarizing current page layout",
      "raw_html_schema": "string containing a SIMPLIFIED version of the current HTML structure (like this : <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>

  <!-- SEO -->
  <meta name="description" content="Short page description">
  <meta name="author" content="Your Name">

  <!-- Styles -->
  <link rel="stylesheet" href="styles.css">
</head>

<body>

  <header>
    <h1>Website Title</h1>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>Section Title</h2>
      <p>Main content goes here.</p>
    </section>

    <article>
      <h2>Article Title</h2>
      <p>Article content.</p>
    </article>
  </main>

  <aside>
    <p>Sidebar content</p>
  </aside>

  <footer>
    <p>© 2025 Your Website</p>
  </footer>

  <!-- Scripts -->
  <script src="script.js"></script>
</body>
</html>)",
      "issues": ["issue 1", "issue 2"]
    },
    "recommended_structure": {
      "description": "string explaining why this structure is better",
      "raw_html_schema": "string containing a COMPLETE semantic HTML5 page template",
      "improvements": ["improvement 1", "improvement 2"]
    }
  },
}

CRITICAL RULES:
- Return ONLY the JSON object, no markdown, no explanation
- All fields must be present
- Use exact enum values shown above
- Provide at least 3-5 recommendations
- DO NOT include SEO scores or marketing analysis
- Focus purely on technical structure`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free",
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
        timeout: 45000,
      }
    );

    const aiResponse = response.data.choices[0].message.content;

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
      console.error("JSON parsing failed:", parseError.message);
      // If JSON parsing fails, return raw response
      parsedData = {
        error: true,
        rawAnalysis: aiResponse,
        note: "AI response was not in valid JSON format",
        structuredData: structuredData, // Include the structured data we parsed
      };
    }

    return {
      success: true,
      parsedData,
      model: response.data.model,
      tokensUsed: response.data.usage,
    };
  } catch (error) {
    console.error("Error in AI analysis:", error.message);
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }
    throw new Error(`AI parsing failed: ${error.message}`);
  }
}
