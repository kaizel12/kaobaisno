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
    const tweetImage = await createTweetImage(displayName, username, comment, avatar);
    res.status(200).json({ image: tweetImage });
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

  // Convert the image into base64 format
  const imageBase64 = tweet.toBase64();  // Assuming 'toBase64' is a method to get base64 encoding of the image.

  return imageBase64;
}
