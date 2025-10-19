import openai from "openai";
import dotenv from "dotenv";

dotenv.config();

const Openai = new openai({
  apiKey: process.env.Gemini_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export default Openai;
