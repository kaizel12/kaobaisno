import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query; // Mengambil ID dari query parameter
  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  const baseUrl = `https://otakudesu.cloud/episode/${id}`; // Menggabungkan ID dengan base URL
  const result = await getEpisodeDetails(baseUrl);

  if (!result) {
    return res.status(500).json({ error: "Failed to fetch episode details" });
  }

  res.status(200).json(result);
}

async function getEpisodeDetails(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
      },
    });
    const $ = cheerio.load(data);

    const episodeTitle = $("h1.entry-title").text().trim();

    // Object to store download links grouped by resolution
    const downloadLinks = {
      "360p": [],
      "480p": [],
      "720p": [],
      "1080p": [],
    };

    // Parsing links
    $(".download ul li").each((index, element) => {
      const resolutionText = $(element).find("strong").text().trim();
      const resolution = resolutionText.match(/\d+p/)?.[0]; // Extract resolution (e.g., "360p", "480p")

      if (resolution && downloadLinks[resolution]) {
        $(element)
          .find("a")
          .each((_, link) => {
            const linkText = $(link).text().trim();
            const linkUrl = $(link).attr("href");
            downloadLinks[resolution].push({ linkText, linkUrl });
          });
      }
    });

    return {
      episodeTitle,
      downloadLinks,
    };
  } catch (error) {
    console.error("Error fetching episode details:", error);
    return null;
  }
}
