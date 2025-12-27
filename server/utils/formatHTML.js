// server/utils/formatHTML.js
import prettier from "prettier";

export function formatHTML(html) {
  try {
    return prettier.format(html, {
      parser: "html",
      tabWidth: 2,
      printWidth: 80,
    });
  } catch {
    return html;
  }
}
