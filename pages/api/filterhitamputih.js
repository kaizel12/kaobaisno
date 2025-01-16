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
    const buffer = await applyBlackAndWhite(url);

    // Set response headers for image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache");

    // Send the canvas buffer directly
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

const applyBlackAndWhite = async (imageUrl) => {
  try {
    // Load the image from the URL
    const image = await loadImage(imageUrl);

    // Create canvas with the same size as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // Draw the original image on the canvas
    ctx.drawImage(image, 0, 0);

    // Get image pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Process each pixel to apply black and white effect
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      // Calculate grayscale value
      const grayscale = 0.3 * red + 0.59 * green + 0.11 * blue;

      // Apply grayscale to Red, Green, and Blue channels
      data[i] = data[i + 1] = data[i + 2] = grayscale;
    }

    // Put processed pixel data back to the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to buffer
    return canvas.toBuffer("image/png");
  } catch (error) {
    throw new Error(`Failed to create black and white effect: ${error.message}`);
  }
};
