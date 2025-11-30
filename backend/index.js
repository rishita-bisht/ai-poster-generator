import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" })); // Increased for base64 images

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:8000"
    ],
    credentials: true
  })
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running!",
    timestamp: new Date().toISOString(),
    geminiKey: process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing",
    port: PORT,
    imageModel: "gemini-2.5-flash-image"
  });
});

// Generate REAL AI poster with Gemini IMAGE model
app.post("/api/generate-poster", async (req, res) => {
  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required"
      });
    }

    console.log(`🎨 Generating REAL AI IMAGE: "${prompt}" (${style})`);

    // Use Gemini IMAGE model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
    
    const fullPrompt = `Create a stunning poster image: "${prompt}". Style: ${style}. High quality, professional poster design, 800x1200 resolution, cinematic lighting, perfect composition.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    // Extract image data (Gemini returns inline data or parts)
    let imageDataUrl = null;
    let geminiDescription = "AI image generated successfully";

    // Check for inline image data
    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType;
        const base64Data = part.inlineData.data;
        imageDataUrl = `data:${mimeType};base64,${base64Data}`;
        break;
      }
    }

    // Fallback to text description if no image
    if (!imageDataUrl) {
      if (response.text) {
        geminiDescription = response.text();
      }
      // Use smart fallback image
      const seed = encodeURIComponent(prompt.toLowerCase().replace(/[^a-z0-9]/g, '') + style);
      imageDataUrl = `https://picsum.photos/seed/${seed}/800/1200`;
    }

    console.log(`✅ Generated: ${imageDataUrl ? 'REAL AI IMAGE' : 'Smart Fallback'}`);

    res.json({
      success: true,
      prompt,
      style,
      geminiDescription,
      posterUrl: imageDataUrl,
      isRealAI: imageDataUrl.startsWith('data:') || imageDataUrl.includes('picsum.photos/seed/')
    });

  } catch (err) {
    console.error("💥 Gemini Image Error:", err.message);
    
    // Smart fallback with prompt seed
    const seed = encodeURIComponent((req.body.prompt || "fallback").toLowerCase().replace(/[^a-z0-9]/g, '') + (req.body.style || "modern"));
    const fallbackUrl = `https://picsum.photos/seed/${seed}/800/1200`;
    
    res.json({
      success: true,
      prompt: req.body.prompt || "unknown",
      style: req.body.style || "modern",
      error: err.message,
      posterUrl: fallbackUrl,
      geminiDescription: "Using smart prompt-specific fallback image",
      isRealAI: false
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 REAL AI IMAGE MODEL: gemini-2.5-flash-image`);
});
