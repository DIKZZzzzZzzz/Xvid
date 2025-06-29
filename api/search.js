import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ status: false, message: "Masukkan query!" });

  try {
    const html = await fetch(`https://www.xvideos.com/?k=${encodeURIComponent(query)}`).then(r => r.text());
    const $ = cheerio.load(html);
    const results = [];

    $('div.mozaique > div.video').each((i, el) => {
      const title = $(el).find('p.title a').text().trim();
      const url = 'https://www.xvideos.com' + $(el).find('p.title a').attr('href');
      const thumb = $(el).find('div.thumb img').attr('data-src') || $(el).find('div.thumb img').attr('src');
      const duration = $(el).find('.duration').text().trim();

      if (title && url && thumb) {
        results.push({ title, url, thumb, duration });
      }
    });

    res.status(200).json({ status: true, total: results.length, results });
  } catch (e) {
    res.status(500).json({ status: false, message: 'Scrape gagal', error: e.message });
  }
}
