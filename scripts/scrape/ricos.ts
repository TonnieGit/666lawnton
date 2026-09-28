// Wix Ricos rich-content JSON → HTML. Wix's V1 catalog API returns product
// descriptions as HTML, but product pages embed the Ricos document, so we convert.

interface RicosNode {
  type: string;
  nodes?: RicosNode[];
  textData?: { text: string; decorations?: { type: string; linkData?: { link?: { url?: string } } }[] };
  headingData?: { level?: number };
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderText(node: RicosNode): string {
  const data = node.textData;
  if (!data) return "";
  let html = escape(data.text).replace(/\n/g, "<br>");
  for (const d of data.decorations ?? []) {
    if (d.type === "BOLD") html = `<strong>${html}</strong>`;
    else if (d.type === "ITALIC") html = `<em>${html}</em>`;
    else if (d.type === "UNDERLINE") html = `<u>${html}</u>`;
    else if (d.type === "LINK" && d.linkData?.link?.url) {
      html = `<a href="${escape(d.linkData.link.url)}" rel="noopener noreferrer">${html}</a>`;
    }
  }
  return html;
}

function render(nodes: RicosNode[] = []): string {
  return nodes
    .map((n) => {
      const inner = render(n.nodes);
      switch (n.type) {
        case "TEXT":
          return renderText(n);
        case "PARAGRAPH":
          return inner ? `<p>${inner}</p>` : "";
        case "HEADING": {
          const level = Math.min(Math.max(n.headingData?.level ?? 3, 2), 6);
          return `<h${level}>${inner}</h${level}>`;
        }
        case "BULLETED_LIST":
          return `<ul>${inner}</ul>`;
        case "ORDERED_LIST":
          return `<ol>${inner}</ol>`;
        case "LIST_ITEM":
          return `<li>${inner}</li>`;
        case "BLOCKQUOTE":
          return `<blockquote>${inner}</blockquote>`;
        case "DIVIDER":
          return "<hr>";
        default:
          return inner; // Unknown/media nodes: keep any text inside.
      }
    })
    .join("");
}

/** Returns HTML, or the input unchanged if it isn't Ricos JSON. */
export function ricosToHtml(input: string): string {
  if (!input.trim().startsWith("{")) return input;
  try {
    const doc = JSON.parse(input) as { nodes?: RicosNode[] };
    return render(doc.nodes);
  } catch {
    return `<p>${escape(input)}</p>`;
  }
}
