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
  const result = await getEpisodeDetailsWithAllOrigins(baseUrl);

  if (!result) {
    return res.status(500).json({ error: "Failed to fetch episode details" });
  }

  res.status(200).json(result);
}

async function getEpisodeDetailsWithAllOrigins(url) {
  try {
    // AllOrigins Proxy URL
    const allOriginsUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const { data } = await axios.get(allOriginsUrl);
    const $ = cheerio.load(data.contents);

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
