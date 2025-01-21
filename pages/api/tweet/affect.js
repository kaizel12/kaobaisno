import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { avatar } = req.query;

  if (!avatar) {
    return res.status(400).json({ error: "Missing required parameter: avatar" });
  }

  try {
    // Menghasilkan gambar "affect" menggunakan Canvafy
    const affectImage = await canvafy.Image.affect(avatar);

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(affectImage).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating affect image", details: error.message });
  }
}
