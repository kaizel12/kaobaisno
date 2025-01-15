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

  // Try using .toPng() or other similar methods if available
  const imageBuffer = await tweet.toPng();  // Assuming toPng() is supported by canvafy

  return imageBuffer;
}
