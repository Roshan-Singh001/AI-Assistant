export async function chunkText(text, size = 500) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const chunks = [];

  for (let i = 0; i < cleaned.length; i += size) {
    chunks.push(cleaned.slice(i, i + size));
  }
  return chunks;
}
