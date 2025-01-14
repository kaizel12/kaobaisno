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
    const canvas = await createWelcomeCard({
      linkbekron,
      linkavatar,
      judul,
      desk
    });

    // Set response headers for image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the canvas buffer directly
    res.send(canvas);
  } catch (error) {
    res.status(500).json({ error: "Error generating image", details: error.message });
  }
}

async function createWelcomeCard(ajasendiri) {
  const { linkbekron, linkavatar, judul, desk } = ajasendiri;
  const width = 700;
  const height = 350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background
  const background = await loadImage(linkbekron);
  ctx.drawImage(background, 0, 0, width, height);

  // Overlay parameters
  const ov1 = 10;
  const ov2 = 10;
  const ov3 = width - 20;
  const ov4 = height - 20;
  const ov5 = 50;

  // Draw semi-transparent overlay with border
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.moveTo(ov1 + ov5, ov2);
  ctx.arcTo(ov1 + ov3, ov2, ov1 + ov3, ov2 + ov4, ov5);
  ctx.arcTo(ov1 + ov3, ov2 + ov4, ov1, ov2 + ov4, ov5);
  ctx.arcTo(ov1, ov2 + ov4, ov1, ov2, ov5);
  ctx.arcTo(ov1, ov2, ov1 + ov3, ov2, ov5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#FFCC33';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();

  // Draw circular avatar
  const avatar = await loadImage(linkavatar.trim());
  const ukuranavatar = 150;
  const av1 = width / 2 - ukuranavatar / 2;
  const av2 = height / 2 - 140;

  ctx.save();
  ctx.beginPath();
  ctx.arc(av1 + ukuranavatar / 2, av2 + ukuranavatar / 2, ukuranavatar / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, av1, av2, ukuranavatar, ukuranavatar);
  ctx.restore();

  // Draw avatar border
  ctx.beginPath();
  ctx.arc(av1 + ukuranavatar / 2, av2 + ukuranavatar / 2, ukuranavatar / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#FFCC33';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Draw title
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(judul, width / 2, av2 + ukuranavatar + 50);

  // Draw description
  ctx.font = '22px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(desk, width / 2, av2 + ukuranavatar + 90);

  // Apply rounded corners mask
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(ov1 + ov5, ov2);
  ctx.arcTo(ov1 + ov3, ov2, ov1 + ov3, ov2 + ov4, ov5);
  ctx.arcTo(ov1 + ov3, ov2 + ov4, ov1, ov2 + ov4, ov5);
  ctx.arcTo(ov1, ov2 + ov4, ov1, ov2, ov5);
  ctx.arcTo(ov1, ov2, ov1 + ov3, ov2, ov5);
  ctx.closePath();
  ctx.fill();

  return canvas.toBuffer();
    }
