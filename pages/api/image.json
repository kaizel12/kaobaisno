import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing required parameter: text" });
  }

  try {
    const canvas = await createTextImage(text);

    // Set response headers for image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");

    // Send the canvas buffer directly
    canvas.toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).json({ error: "Error generating image", details: err.message });
      }
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

async function createTextImage(text) {
  const canvasWidth = 800;
  const canvasHeight = 600;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  try {
    // Load background image
    const backgroundImageUrl = "https://8030.us.kg/file/bxTczZTSNI4i.png";
    const backgroundImage = await loadImage(backgroundImageUrl);
    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // Add text
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#3a2cc1";
    ctx.textAlign = "center";
    ctx.fillText(text, canvasWidth / 2, canvasHeight - 310);

    return canvas;
  } catch (error) {
    throw new Error(`Error creating image: ${error.message}`);
  }
}
