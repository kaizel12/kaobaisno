import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { author, album, timestampStart, timestampEnd, image, title } = req.query;

  if (!author || !album || !timestampStart || !timestampEnd || !image || !title) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Membuat gambar Spotify menggunakan Canvafy
    const spotify = await new canvafy.Spotify()
      .setAuthor(author)
      .setAlbum(album)
      .setTimestamp(Number(timestampStart), Number(timestampEnd))
      .setImage(image)
      .setTitle(title)
      .setBlur(5) // Nilai blur default
      .setOverlayOpacity(0.7) // Nilai overlay opacity default
      .build();

    // Konversi gambar langsung ke Base64
    const base64Image = Buffer.from(spotify).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}`, // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating Spotify image", details: error.message });
  }
}
