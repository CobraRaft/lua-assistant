export default async function handler(req, res) {
  const { question } = req.body;

  const q = `${question} site:devforum.roblox.com OR site:scriptinghelpers.org OR site:stackoverflow.com`;

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&key=${process.env.GOOGLE_KEY}&cx=${process.env.SEARCH_ENGINE_ID}`
  );

  const data = await response.json();

  const results = data.items ? data.items.slice(0, 3).map(r => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet
  })) : [];

  res.status(200).json({ results });
}
