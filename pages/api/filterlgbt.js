import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const canvas = await applyLGBTOverlay(url);

    // Set response headers for image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");

    // Send the canvas buffer directly
    const buffer = canvas.toBuffer("image/png");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

async function applyLGBTOverlay(imageUrl) {
  try {
    // Load the image from the URL
    const image = await loadImage(imageUrl);

    // Create canvas with the same size as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // Draw the base image
    ctx.drawImage(image, 0, 0);

    // LGBT flag colors
    const colors = ['#FF0000', '#FF8000', '#FFFF00', '#008000', '#0000FF', '#800080'];
    const stripeHeight = canvas.height / colors.length;

    // Apply the LGBT overlay with transparency
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3; // Transparency
      ctx.fillRect(0, stripeHeight * index, canvas.width, stripeHeight);
    });

    // Reset globalAlpha
    ctx.globalAlpha = 1.0;

    return canvas;
  } catch (error) {
    throw new Error(`Failed to create LGBT overlay: ${error.message}`);
  }
}
