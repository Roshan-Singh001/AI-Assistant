import * as pdfParse from "pdf-parse"
import mammoth from "mammoth";
import officeparser from "officeparser"


export async function extractText(file) {
  const { mimetype, buffer } = file;

  if (mimetype === "application/pdf") {
    const uint8Array = new Uint8Array(buffer);
    const parse = new pdfParse.PDFParse(uint8Array);
    const result = await parse.getText();
    return result.text;
  }

  if (mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimetype.includes("presentation")) {
    try {
      const text = await officeparser.parseOfficeAsync(buffer);
      return text || "";
    } catch (err) {
      console.error("PPTX parse error:", err);
      throw new Error("Failed to parse PowerPoint file");
    }
  }

  if (mimetype === "text/plain") {
    return buffer.toString();
  }

  throw new Error("Unsupported file type");
}
