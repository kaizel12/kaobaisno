import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  const baseUrl = `https://otakudesu.cloud/anime/${id}`;
  const result = await fetchAnimeDetails(baseUrl);

  if (!result) {
    return res.status(500).json({ error: "Failed to fetch anime details" });
  }

  res.status(200).json(result);
}

async function fetchAnimeDetails(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    // Ambil judul anime
    const title = $("div.jdlrx h1").text().trim();

    // Ambil sinopsis
    const synopsis = $(".sinopc").text().trim();

    // Ambil genre
    const genres = [];
    $(".infozingle a").each((index, element) => {
      genres.push($(element).text().trim());
    });

    // Ambil skor
    const score = $('.infozingle p:contains("Skor")')
      .text()
      .replace("Skor:", "")
      .trim();

    // Ambil produser
    const producers = $('.infozingle p:contains("Produser")')
      .text()
      .replace("Produser:", "")
      .trim();

    // Ambil tipe
    const type = $('.infozingle p:contains("Tipe")')
      .text()
      .replace("Tipe:", "")
      .trim();

    // Ambil status
    const status = $('.infozingle p:contains("Status")')
      .text()
      .replace("Status:", "")
      .trim();

    // Ambil total episode
    const totalEpisodes = $('.infozingle p:contains("Total Episode")')
      .text()
      .replace("Total Episode:", "")
      .trim();

    // Ambil durasi
    const duration = $('.infozingle p:contains("Durasi")')
      .text()
      .replace("Durasi:", "")
      .trim();

    // Ambil tanggal rilis
    const releaseDate = $('.infozingle p:contains("Tanggal Rilis")')
      .text()
      .replace("Tanggal Rilis:", "")
      .trim();

    // Ambil studio
    const studio = $('.infozingle p:contains("Studio")')
      .text()
      .replace("Studio:", "")
      .trim();

    // Ambil daftar episode
    const episodes = [];
    $(".episodelist ul li").each((index, element) => {
      const episodeTitle = $(element).find("a").text().trim();
      const episodeUrl = $(element).find("a").attr("href");
      episodes.push({ episodeTitle, episodeUrl });
    });

    return {
      title,
      synopsis,
      genres,
      score,
      producers,
      type,
      status,
      totalEpisodes,
      duration,
      releaseDate,
      studio,
      episodes,
    };
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
}
