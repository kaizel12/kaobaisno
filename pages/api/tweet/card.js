import fs from 'fs';
import path from 'path';
import canvafy from "canvafy";
import { tmpdir } from 'os';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { displayName, username, comment, avatar } = req.query;

  if (!displayName || !username || !comment || !avatar) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const tweetImagePath = await createTweetImage(displayName, username, comment, avatar);
    res.setHeader('Content-Type', 'image/png');  // Set content type for PNG image
    res.status(200).sendFile(tweetImagePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error sending image", details: err.message });
      }
      // Clean up the temporary file after sending it
      fs.unlinkSync(tweetImagePath);
    });
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

  // Save the generated image to a temporary file
  const tempImagePath = join(tmpdir(), `tweet_${Date.now()}.png`);
  await tweet.toFile(tempImagePath);  // Assuming `toFile` is available and saves the image to a file

  return tempImagePath;
}
