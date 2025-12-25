# Website Structure Analysis Tool

A full-stack web application that analyzes the **structural quality of a website** using machine-readable and semantic indicators. The tool helps developers, SEO specialists, and product teams understand how well a website is organized for **automated systems, search engines, and accessibility tools**.

The application accepts a website URL, analyzes its HTML structure on the backend, and returns an overall structure score along with a detailed breakdown and actionable recommendations.

## ✨ Features

- Analyze any public website via URL
- Overall Structure Score (0–100)
- AI-assisted semantic and structural analysis
- Category-level breakdown:

  - Semantic Markup
  - DOM Structure Clarity
  - Content Organization
  - Metadata & Structured Markup
  - Script Dependency
  - Accessibility Signals

- Human-readable summary & recommendations
- Modern, responsive UI

## 🏗️ Tech Stack

### Frontend

- **Vue 3** (Options API)
- **Tailwind CSS** (v3.4.17)
- **Axios** (API communication)
- **Lucide Icons** (`lucide-vue-next`)

### Backend

- **Node.js** (Express)
- **Axios** (HTML fetching)
- **OpenRouter AI API** (LLM-based semantic analysis)

## 📐 High-Level Architecture

```
[ Vue Frontend ]
        |
        |  POST /api/analyze
        v
[ Node.js Backend ]
        |
        |  Fetch Website HTML
        |  Send data to LLM
        v
[ OpenRouter AI ]
        |
        v
[ Analysis JSON Response ]
        |
        v
[ Frontend Visualization ]
```

## 📊 Analysis Output (Response Schema)

```json
{
  "success": true,
  "url": "https://example.com",
  "analysis": {
    "overall_structure_score": 90,
    "summary": {
      "overall_assessment": "High-quality, well-structured HTML with clear hierarchy.",
      "primary_strengths": [],
      "primary_weaknesses": []
    },
    "semantic_markup": {},
    "dom_structure": {},
    "script_dependency": {},
    "accessibility_signals": {},
    "metadata": {},
    "recommendations": []
  },
  "metadata": {
    "model": "meta-llama/llama-3.3-70b-instruct",
    "tokensUsed": {},
    "processingTimeMs": 15000
  }
}
```

## 🧑‍💻 Local Setup & Installation

### Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git**

## Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mannankhan-05/website-structure-analysis.git
cd website-structure-analysis
```

## 🔧 Backend Setup (Server)

### 2️⃣ Navigate to Backend Directory

```bash
cd server
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Environment Variables

Create a `.env` file inside the `server` directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> ⚠️ You must have a valid OpenRouter API key. Free-tier models may be rate-limited.

### 5️⃣ Start Backend Server

```bash
npm run dev
```

The backend will start on:

```
http://localhost:5000
```

## 🎨 Frontend Setup (Client)

### 6️⃣ Navigate to Frontend Directory

```bash
cd client
```

### 7️⃣ Install Dependencies

```bash
npm install
```

### 8️⃣ Start Frontend Dev Server

```bash
npm run serve
```

The app will be available at:

```
http://localhost:8080
```

## 🧪 Usage

1. Open the frontend in your browser
2. Enter a valid website URL (e.g. `https://github.com`)
3. Click **Analyze**
4. Wait for analysis to complete
5. View structure score, breakdown, and recommendations

## ⚠️ Common Issues & Troubleshooting

### OpenRouter 429 Error (Rate Limit)

- Free-tier models are heavily rate-limited
- Use retries with backoff or switch to a paid model

### Tailwind "Unknown word 'use strict'"

- Ensure Tailwind is loaded via PostCSS
- Do NOT import `tailwindcss` directly in CSS

## 🧠 Design Goals

- Clean separation of frontend and backend
- API-driven communication
- Human-readable insights
- Production-ready architecture

## 🔮 Future Improvements

- Authentication & saved reports
- Export reports (PDF / JSON)
- Multi-page crawling
- Accessibility scoring (WCAG)

## 📄 License

MIT License

## 🙌 Author

Built by **Abdul Mannan Khan**

If you find this project useful, feel free to ⭐ the repository and contribute!
