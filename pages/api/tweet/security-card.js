import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { avatar, background, createdTimestamp, suspectTimestamp, border, avatarBorder, locale } = req.query;

  if (!avatar || !background || !createdTimestamp || !suspectTimestamp || !border || !avatarBorder || !locale) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Menghasilkan kartu keamanan menggunakan Canvafy
    const securityCard = await new canvafy.Security()
      .setAvatar(avatar)
      .setBackground("image", background)
      .setCreatedTimestamp(Number(createdTimestamp))
      .setSuspectTimestamp(Number(suspectTimestamp))
      .setBorder(border)
      .setLocale(locale)
      .setAvatarBorder(avatarBorder)
      .setOverlayOpacity(0.9)
      .build();

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(securityCard).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating security card", details: error.message });
  }
}
