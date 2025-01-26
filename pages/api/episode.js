import puppeteer from 'puppeteer';

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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const episodeTitle = await page.$eval("h1.entry-title", (el) => el.textContent.trim());

    // Object to store download links grouped by resolution
    const downloadLinks = {
      "360p": [],
      "480p": [],
      "720p": [],
      "1080p": [],
    };

    // Parsing download links for different resolutions
    const links = await page.$$eval(".download ul li", (items) => {
      return items.map((item) => {
        const resolutionText = item.querySelector("strong")?.textContent.trim();
        const resolution = resolutionText?.match(/\d+p/)?.[0];

        const downloadLinkArray = [];
        item.querySelectorAll("a").forEach((link) => {
          downloadLinkArray.push({
            linkText: link.textContent.trim(),
            linkUrl: link.href,
          });
        });
        return { resolution, downloadLinkArray };
      });
    });

    // Organize the links by resolution
    links.forEach((linkData) => {
      if (linkData.resolution && downloadLinks[linkData.resolution]) {
        downloadLinks[linkData.resolution] = linkData.downloadLinkArray;
      }
    });

    return { episodeTitle, downloadLinks };
  } catch (error) {
    console.error("Error fetching episode details:", error);
    return null;
  } finally {
    await browser.close();
  }
}
