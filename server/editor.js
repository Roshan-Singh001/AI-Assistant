import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
const editorRouter = express.Router();

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

editorRouter.post("/api/generate-code", async (req, res) => {
  const { logicCode, language } = req.body;
  console.log("Received logic code:", logicCode);

  try {
    const prompt = `
    You are an expert competitive programmer.
    I will give you a ${language} function body (logic only) for a DSA problem.
    Wrap it into a complete, runnable program:
    - Add necessary imports
    - Add input handling (read from stdin)
    - Add output printing
    - Keep the function name the same
    - Do not change the algorithm logic

    Logic code:
    ${logicCode}
    `;

    const result = await model.generateContent(prompt);
    var fullCode = result.response.text();

    fullCode = fullCode.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```[a-zA-Z]*\n?/, "").replace(/```/, "");
    }).trim();

    console.log("Generated full code:", fullCode);

    res.status(200).json({ fullCode });
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

editorRouter.post("/api/generate-test-cases", async (req, res) => {
  const { logicCode, language, difficulty = "medium" } = req.body;

  try {
    const prompt = `
    You are an expert DSA problem setter.
    Based on the following ${language} logic function:
    ${logicCode}

    Generate 3-5 diverse test cases as JSON.
    - Cover edge cases, normal cases, and large input cases.
    - Use realistic and valid inputs for this problem.
    - Include expected output for each input.
    - Return ONLY valid JSON, like:
    [
      { "input": "4\\n2 7 11 15\\n9", "expected_output": "0 1" },
      { "input": "5\\n1 2 3 4 5\\n10", "expected_output": "-1" }
    ]
    `;

    const result = await model.generateContent(prompt);
    let jsonText = result.response.text();

    jsonText = jsonText
      .replace(/```json|```/g, "")
      .trim();

    const testCases = JSON.parse(jsonText);

    console.log("Generated test cases:", testCases);
    res.status(200).json({ testCases });
  } catch (err) {
    console.error("Test case generation error:", err.message);
    res.status(500).json({ error: "Failed to generate test cases" });
  }
});


editorRouter.post("/api/run-code", async (req, res) => {
  const { fullCode, languageId, input } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: fullCode,
        language_id: languageId,
        stdin: input
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );

    console.log("Execution result:", response.data);

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Judge0 Error:", err.message);
    res.status(500).json({ error: "Code execution failed" });
  }
});

export default editorRouter;
