import canvafy from "canvafy";

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username,
      likeCount,
      likeText,
      avatar,
      postImage,
      verified = "false",
      story = "false",
      liked = "false",
      saved = "false"
    } = req.query;

    // Validate required parameters
    if (!username || !likeCount || !likeText || !avatar || !postImage) {
      return res.status(400).json({ 
        error: "Missing required parameters",
        required: ["username", "likeCount", "likeText", "avatar", "postImage"],
        received: { username, likeCount, likeText, avatar, postImage }
      });
    }

    // Validate URLs
    try {
      new URL(avatar);
      new URL(postImage);
    } catch (error) {
      return res.status(400).json({ 
        error: "Invalid URL format",
        details: error.message 
      });
    }

    // Validate likeCount is a number
    if (isNaN(Number(likeCount))) {
      return res.status(400).json({ 
        error: "likeCount must be a number",
        received: likeCount
      });
    }

    // Add delay to ensure images are loaded
    await delay(2000);

    // Create the Instagram image
    const instagram = await new canvafy.Instagram()
      .setTheme("light")
      .setUser({ username })
      .setLike({ 
        count: Number(likeCount), 
        likeText: decodeURIComponent(likeText) 
      })
      .setVerified(verified === "true")
      .setStory(story === "true")
      .setPostDate(Date.now() - 1000 * 60 * 60 * 24 * 2)
      .setAvatar(decodeURIComponent(avatar))
      .setPostImage(decodeURIComponent(postImage))
      .setLiked(liked === "true")
      .setSaved(saved === "true")
      .build();

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    // Send the response
    return res.status(200).send(instagram);

  } catch (error) {
    console.error('Error generating Instagram post:', error);
    return res.status(500).json({ 
      error: "Error generating Instagram post", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
