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
    const imageBase64 = await createCustomImage(url);
    res.status(200).json({ image: imageBase64 });
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

async function createCustomImage(url) {
  const canvasWidth = 1200;
  const canvasHeight = 720;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  try {
    // Load background image
    const backgroundImageUrl = "https://8030.us.kg/file/Hp4e6exz4cqq.jpeg";
    const backgroundImage = await loadImage(backgroundImageUrl);
    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // Main image dimensions
    const imgWidth = 260;
    const imgHeight = 225;
    
    // Position calculations
    const x = (canvasWidth - imgWidth) / 2 - 300; // Shift left
    const y = (canvasHeight - imgHeight) / 3; // Shift down

    // Save context before rotation
    ctx.save();
    
    // Apply rotation
    const angle = -0.05;
    ctx.translate(x + imgWidth / 2, y + imgHeight / 2);
    ctx.rotate(angle);

    // Draw curved border
    const borderSize = 10;
    const radius = 20;
    
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(-imgWidth / 2, -imgHeight / 2 + radius);
    ctx.lineTo(imgWidth / 2, -imgHeight / 2 + radius);
    ctx.quadraticCurveTo(imgWidth / 2 + borderSize, -imgHeight / 2, imgWidth / 2 + borderSize, -imgHeight / 2 + radius);
    ctx.lineTo(imgWidth / 2 + borderSize, imgHeight / 2 - radius);
    ctx.quadraticCurveTo(imgWidth / 2 + borderSize, imgHeight / 2, imgWidth / 2, imgHeight / 2);
    ctx.lineTo(-imgWidth / 2, imgHeight / 2);
    ctx.quadraticCurveTo(-imgWidth / 2 - borderSize, imgHeight / 2, -imgWidth / 2 - borderSize, imgHeight / 2 - radius);
    ctx.lineTo(-imgWidth / 2 - borderSize, -imgHeight / 2 + radius);
    ctx.quadraticCurveTo(-imgWidth / 2 - borderSize, -imgHeight / 2, -imgWidth / 2, -imgHeight / 2 + radius);
    ctx.closePath();
    ctx.fill();

    // Load and draw main image
    const mainImage = await loadImage(url);
    ctx.drawImage(mainImage, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

    // Restore context
    ctx.restore();

    // Convert to base64
    return canvas.toDataURL('image/png').split(',')[1];
  } catch (error) {
    throw new Error(`Error creating image: ${error.message}`);
  }
}
