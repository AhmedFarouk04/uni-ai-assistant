export function detectLanguage(text) {
  const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
  const latinChars = text.match(/[a-zA-Z]/g) || [];

  if (latinChars.length >= arabicChars.length) {
    return "en";
  }

  return "ar";
}
