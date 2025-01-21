import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { avatar1, avatar2 } = req.query;

  if (!avatar1 || !avatar2) {
    return res.status(400).json({ error: "Missing required parameters: avatar1, avatar2" });
  }

  try {
    // Menghasilkan gambar "kiss" menggunakan Canvafy
    const kissImage = await canvafy.Image.kiss(avatar1, avatar2);

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(kissImage).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating kiss image", details: error.message });
  }
}
