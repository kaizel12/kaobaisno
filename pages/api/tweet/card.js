import fs from 'fs';
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
    const tweetImagePath = await createTweetImage(displayName, username, comment, avatar);
    const imageBuffer = fs.readFileSync(tweetImagePath); // Baca file gambar
    const base64Image = imageBuffer.toString('base64'); // Konversi ke Base64

    // Hapus file sementara setelah membaca
    fs.unlinkSync(tweetImagePath);

    // Kirimkan gambar dalam format Base64
    res.status(200).json({
      image: `data:image/png;base64,${base64Image}` // Format Base64 dengan prefix data URL
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating tweet", details: error.message });
  }
}

async function createTweetImage(displayName, username, comment, avatar) {
  const tweet = await new canvafy.Tweet()
    .setTheme("light")
    .setUser({ displayName, username })
    .setVerified(true)
    .setComment(comment)
    .setAvatar(avatar)
    .build();

  // Simpan file sementara di folder kerja
  const tempImagePath = `tweet_${Date.now()}.png`;
  await tweet.toFile(tempImagePath); // Pastikan `toFile` tersedia

  return tempImagePath;
}
