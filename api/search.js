import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query kosong!" });

  try {
    const response = await axios.get(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`);
    const $ = cheerio.load(response.data);

    const hasil = [];
    $("div.mozaique div.thumb-block").each((i, el) => {
      const title = $(el).find("p.title a").text().trim();
      const url = "https://www.xvideos.com" + $(el).find("p.title a").attr("href");
      const duration = $(el).find(".duration").text().trim();
      const thumb = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

      if (title && url && thumb) {
        hasil.push({ title, url, duration, thumb });
      }
    });

    res.status(200).json({ result: hasil });
  } catch (e) {
    console.error("❌ Error search:", e.message);
    res.status(500).json({ error: "Gagal mengambil data Xvideos." });
  }
}
