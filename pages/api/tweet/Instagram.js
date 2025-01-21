import canvafy from "canvafy";

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
    // Membuat gambar Instagram menggunakan Canvafy
    const instagram = await new canvafy.Instagram()
      .setTheme("light") // Tema Light
      .setUser({ username }) // Username
      .setLike({ count: Number(likeCount), likeText }) // Like
      .setVerified(verified === "true") // Verified User
      .setStory(story === "true") // Instagram Story
      .setPostDate(Date.now() - 1000 * 60 * 60 * 24 * 2) // Post date (2 hari lalu)
      .setAvatar(avatar) // URL Avatar
      .setPostImage(postImage) // URL Gambar Postingan
      .setLiked(liked === "true") // Status Liked
      .setSaved(saved === "true") // Status Saved
      .build();

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(instagram).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating Instagram post", details: error.message });
  }
}
