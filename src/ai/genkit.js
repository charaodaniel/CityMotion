import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash"
});
export {
  ai
};
