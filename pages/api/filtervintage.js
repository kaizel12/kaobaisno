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
    const buffer = await applyVintage(url);

    // Set response headers for image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");

    // Send the canvas buffer directly
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

const applyVintage = async (imageUrl) => {
  try {
    const image = await loadImage(imageUrl);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * 0.9 + 20; // Red
      data[i + 1] = data[i + 1] * 0.8 + 15; // Green
      data[i + 2] = data[i + 2] * 0.6; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toBuffer("image/png");
  } catch (error) {
    throw new Error(`Failed to create vintage effect: ${error.message}`);
  }
};
