import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { linkbekron, linkavatar, judul, desk } = req.query;

  if (!linkbekron || !linkavatar || !judul || !desk) {
    return res.status(400).json({ 
      error: "Missing parameters", 
      required: ["linkbekron", "linkavatar", "judul", "desk"] 
    });
  }

  try {
    const canvas = await createWelcomeCard({ linkbekron, linkavatar, judul, desk });

    // Set response headers for image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');

    // Send the canvas buffer directly
    res.send(canvas.toBuffer('image/png'));
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

async function createWelcomeCard({ linkbekron, linkavatar, judul, desk }) {
  const canvasWidth = 1200;
  const canvasHeight = 720;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Load background
  const background = await loadImage(linkbekron);
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

  // Draw semi-transparent overlay
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  const padding = 20;
  const borderRadius = 30;
  ctx.beginPath();
  ctx.moveTo(padding + borderRadius, padding);
  ctx.arcTo(canvasWidth - padding, padding, canvasWidth - padding, canvasHeight - padding, borderRadius);
  ctx.arcTo(canvasWidth - padding, canvasHeight - padding, padding, canvasHeight - padding, borderRadius);
  ctx.arcTo(padding, canvasHeight - padding, padding, padding, borderRadius);
  ctx.arcTo(padding, padding, canvasWidth - padding, padding, borderRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Draw avatar
  const avatarSize = 150;
  const avatarX = canvasWidth / 2 - avatarSize / 2;
  const avatarY = 150;

  const avatar = await loadImage(linkavatar.trim());
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  // Draw avatar border
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#FFCC33';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Draw title
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(judul, canvasWidth / 2, avatarY + avatarSize + 60);

  // Draw description
  ctx.font = '22px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(desk, canvasWidth / 2, avatarY + avatarSize + 100);

  return canvas;
}
