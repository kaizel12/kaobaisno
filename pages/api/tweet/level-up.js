import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { avatar, background, username, border, avatarBorder, currentLevel, nextLevel } = req.query;

  if (!avatar || !background || !username || !border || !avatarBorder || !currentLevel || !nextLevel) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Menghasilkan kartu level-up menggunakan Canvafy
    const levelUpCard = await new canvafy.LevelUp()
      .setAvatar(avatar)
      .setBackground("image", background)
      .setUsername(username)
      .setBorder(border)
      .setAvatarBorder(avatarBorder)
      .setOverlayOpacity(0.7)
      .setLevels(Number(currentLevel), Number(nextLevel))
      .build();

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(levelUpCard).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating level-up card", details: error.message });
  }
}
