import canvafy from "canvafy";

// Fungsi untuk menunda eksekusi
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    username,
    likeCount,
    likeText,
    avatar,
    postImage,
    verified,
    story,
    liked,
    saved
  } = req.query;

  if (!username || !likeCount || !likeText || !avatar || !postImage) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Tambahkan delay sebelum membuat gambar
    await delay(7000); // Delay 5 detik (5000 ms)

    // Create the Instagram image using Canvafy
    const instagram = await new canvafy.Instagram()
      .setTheme("light") // Light theme
      .setUser({ username }) // Set the username
      .setLike({ count: Number(likeCount), likeText }) // Set the like count and text
      .setVerified(verified === "true") // Verified user
      .setStory(story === "true") // Instagram story flag
      .setPostDate(Date.now() - 1000 * 60 * 60 * 24 * 2) // Post date (2 days ago)
      .setAvatar(avatar) // Avatar URL
      .setPostImage(postImage) // Post image URL
      .setLiked(liked === "true") // Liked status
      .setSaved(saved === "true") // Saved status
      .build();

    // Send the image buffer directly in the response
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(instagram); // Send the image buffer

  } catch (error) {
    res.status(500).json({ error: "Error generating Instagram post", details: error.message });
  }
}
