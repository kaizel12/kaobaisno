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
    // Membuat gambar tweet menggunakan Canvafy
    const tweet = await new canvafy.Tweet()
      .setTheme("light")
      .setUser({ displayName, username })
      .setVerified(true)
      .setComment(comment)
      .setAvatar(avatar)
      .build();

    // Konversi gambar langsung ke Base64
    const base64Image = Buffer.from(tweet).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}`, // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating tweet", details: error.message });
  }
}
