import canvafy from "canvafy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: "Missing required parameter: imageUrl" });
  }

  try {
    // Membuat gambar menggunakan metode beautiful
    const beautifulImage = await canvafy.Image.beautiful(imageUrl);

    // Konversi gambar ke Base64
    const base64Image = Buffer.from(beautifulImage).toString("base64");

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating beautiful image", details: error.message });
  }
}
