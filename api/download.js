import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || !url.includes('xvideos.com')) {
    return res.status(400).json({ status: false, message: "URL tidak valid." });
  }

  try {
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const script = $('script').filter((i, el) => $(el).html().includes('setVideoUrlHigh')).html();
    const match = script.match(/setVideoUrlHigh\('(.+?)'\)/);
    const videoUrl = match ? match[1] : null;

    if (!videoUrl) return res.status(404).json({ status: false, message: "Video tidak ditemukan." });

    res.status(200).json({ status: true, videoUrl });
  } catch (e) {
    res.status(500).json({ status: false, message: "Gagal ambil data video.", error: e.message });
  }
}
