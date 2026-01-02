export function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\u0600-\u06FF\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
