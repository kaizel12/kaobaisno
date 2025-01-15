import { createCanvas, loadImage } from 'canvas';
import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { displayName, username, comment, avatar } = req.query;

  if (!displayName || !username || !comment || !avatar) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const tweetImageBuffer = await createTweetImage(displayName, username, comment, avatar);
    res.setHeader('Content-Type', 'image/png');  // Set content type for PNG image
    res.status(200).send(tweetImageBuffer);  // Send the image buffer directly
  } catch (error) {
    res.status(500).json({ error: "Error generating tweet", details: error.message });
  }
}

async function createTweetImage(displayName, username, comment, avatar) {
  const tweet = await new canvafy.Tweet()
    .setTheme("light")
    .setUser({ displayName, username })
    .setVerified(true)
    .setComment(comment)
    .setAvatar(avatar)
    .build();

  // Set up a canvas to draw the tweet
  const canvas = createCanvas(800, 400); // Adjust size as necessary
  const ctx = canvas.getContext('2d');

  // Draw the tweet elements (simple example, you can add more details here)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load and draw avatar image
  const avatarImage = await loadImage(avatar); // Load avatar image
  ctx.drawImage(avatarImage, 10, 10, 50, 50); // Draw avatar at a fixed position

  // Draw display name and username
  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  ctx.fillText(displayName, 70, 30);
  ctx.fillText(`@${username}`, 70, 60);

  // Draw the comment text
  ctx.font = '16px Arial';
  ctx.fillText(comment, 10, 100, canvas.width - 20);

  // Convert the canvas to a PNG image buffer
  const imageBuffer = canvas.toBuffer('image/png');

  return imageBuffer;
}
