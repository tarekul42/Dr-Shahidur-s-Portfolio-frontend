import DOMPurify from "isomorphic-dompurify";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "a",
    "img",
    "blockquote",
    "pre",
    "code",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "br",
    "hr",
    "span",
    "div",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "class",
    "target",
    "rel",
    "colspan",
    "rowspan",
  ],
};

/** Sanitize CMS/HTML content before rendering (server or client). */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}
