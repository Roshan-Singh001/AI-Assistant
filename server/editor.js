import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
const editorRouter = express.Router();

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
You are an expert competitive programming assistant. Always follow these rules strictly:

[Code Generation Rules]
- When given partial logic or a function, generate a complete runnable program in the specified language.
- The program must:
  - Read all inputs from standard input (stdin).
  - Parse input exactly as competitive programming platforms expect.
  - Print ONLY the final required output. No debug statements.
  - Do NOT include built-in test cases or hardcoded examples.
  - Return code without markdown fences or explanations.
`
});

const testModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  systemInstruction: `
You are an expert competitive programming assistant. Always follow these rules strictly:

[Test Case Generation Rules]
- Generate ONLY valid JSON.
- JSON format must be an array of objects: [{"input": "...", "expected_output": "..."}].
- No markdown, no text before/after, no headings, no comments.
- Test cases must exactly match stdin parsing in the program.
`
});



editorRouter.post("/api/run-full", async (req, res) => {
  const { logicCode, language } = req.body;

  console.log("Received logic code for full run:", logicCode);

  try {

    const codeResult = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Convert this ${language} function logic into a complete runnable program that reads input from stdin and prints only the final result:\n\n${logicCode}` }] }],
    });
    let fullCode = codeResult.response.text().replace(/```[a-z]*|```/g, "").trim();

    console.log("Generated full code:", fullCode);

    const testResult = await testModel.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate 3-5 diverse test cases for this ${language} program. Code: ${fullCode}` }] }],
    });
    let testCases = testResult.response.text().replace(/```json|```/g, "").trim();
    testCases = JSON.parse(testCases);
    console.log("Generated test cases:", testCases);

    const languageMap = { javascript: 63, python: 71, cpp: 54, java: 62 };
    const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
    const results = await Promise.all(
      testCases.map(async (tc) => {
        const runRes = await axios.post(`${JUDGE0_API_URL}`, {
          source_code: fullCode,
          language_id: languageMap[language],
          stdin: tc.input,
        }, {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          }
        });
        console.log("Run result for input:", tc.input, runRes.data);
         const output = runRes.data.stdout
          ? runRes.data.stdout.trim()
          : runRes.data.stderr || runRes.data.compile_output || "";
        return {
          input: tc.input,
          expected: tc.expected_output,
          output,
          passed: String(output).trim() === String(tc.expected_output).trim()
        };
      })
    );
    console.log("Test results:", results);

    res.status(200).json({ fullCode, testCases, results });

  } catch (err) {
    console.error(err);
    console.error("Full run error:", err.message);
    res.status(500).json({ error: "Failed to run full flow" });
  }
});


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

editorRouter.post("/api/generate-test-inputs", async (req, res) => {
  const { logicCode, language } = req.body;

  const prompt = `
  Based on the following ${language} function logic:
  ${logicCode}

  Generate 4-6 diverse input strings for stdin testing.
  Include edge cases, normal cases, and one large input.
  Only return a JSON array of strings, like:
  [
    "4\\n2 7 11 15\\n9",
    "5\\n1 2 3 4 5\\n10"
  ]
  `;

  try {
    const result = await model.generateContent(prompt);
    let jsonText = result.response.text().replace(/```json|```/g, "").trim();
    const testInputs = JSON.parse(jsonText);
    res.status(200).json({ testInputs });
  } catch (err) {
    console.error("Test input generation error:", err.message);
    res.status(500).json({ error: "Failed to generate test inputs" });
  }
});

editorRouter.post("/api/run-multiple", async (req, res) => {
  const { fullCode, languageId, inputs } = req.body;

  const results = await Promise.all(
    inputs.map(async (input) => {
      const runRes = await axios.post("https://api.judge0.com/submissions?base64_encoded=false&wait=true", {
        source_code: fullCode,
        language_id: languageId,
        stdin: input
      });
      return { input, output: runRes.data.stdout?.trim() || runRes.data.stderr?.trim() || "No output" };
    })
  );

  res.status(200).json({ results });
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
