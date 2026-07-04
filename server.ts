import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client with standard configuration
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Server-side API endpoint for AI Custom Practice Generator
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== "string" || topic.trim() === "") {
       res.status(400).json({ error: "Topic is required" });
       return;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return a friendly fallback text if API key is missing
      res.json({
        title: `Latihan: ${topic.substring(0, 20)}`,
        text: `Ini adalah contoh teks latihan kustom untuk topik "${topic}". Latihan ini dibuat sebagai cadangan karena kunci API Gemini belum dikonfigurasi di Settings > Secrets. Tetap semangat berlatih mengetik untuk meningkatkan kecepatan dan akurasi jemari Anda!`,
        difficulty: "medium",
        isDemo: true
      });
      return;
    }

    const prompt = `Buatkan satu teks latihan mengetik interaktif dalam Bahasa Indonesia tentang topik: "${topic}".
Teks ini ditujukan untuk pemula yang sedang belajar mengetik 10 jari.

Aturan Pembuatan:
1. Teks harus menarik, mendidik, dan alami dalam Bahasa Indonesia.
2. Panjang teks harus berkisar antara 130 hingga 220 karakter.
3. Hindari penggunaan baris baru (newline) atau karakter tab. Hanya gunakan spasi normal.
4. Gunakan tanda baca standar seperti titik (.), koma (,), tanda tanya (?), atau tanda seru (!). Hindari simbol aneh atau tanda kutip yang sulit diketik.
5. Tentukan tingkat kesulitan berdasarkan panjang kata dan kompleksitas tanda baca.

Harap berikan respons dalam format JSON dengan skema berikut:
{
  "title": "Judul singkat latihan",
  "text": "Isi teks latihan lengkap tanpa baris baru",
  "difficulty": "easy" | "medium" | "hard"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Short descriptive title of the typing exercise."
            },
            text: {
              type: Type.STRING,
              description: "The typing exercise content itself. Must be flat text, no newlines."
            },
            difficulty: {
              type: Type.STRING,
              description: "The estimated difficulty of the typing task ('easy', 'medium', or 'hard')."
            }
          },
          required: ["title", "text", "difficulty"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const lessonData = JSON.parse(resultText.trim());
    res.json(lessonData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      error: "Gagal menghasilkan materi latihan AI.",
      details: error.message || error
    });
  }
});

// Vite Middleware Integration for asset serving and Hot Reload support
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
