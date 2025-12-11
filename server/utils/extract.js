import * as pdfParse from "pdf-parse"
import mammoth from "mammoth";
import pptx2json from "pptx2json";

export async function extractText(file) {
  const { mimetype, buffer } = file;

  if (mimetype === "application/pdf") {
    return (await pdfParse(buffer)).text;
  }

  if (mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimetype.includes("presentation")) {
    const data = await pptx2json.parse(buffer);
    return data.slides.map(slide => slide.text).join("\n");
  }

  if (mimetype === "text/plain") {
    return buffer.toString();
  }

  throw new Error("Unsupported file type");
}
