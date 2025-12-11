import ollama from "ollama";

export async function embed(text) {
  const res = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: text
  });

  console.log("Embedding response:", res.embedding);
  return res.embedding;
}
