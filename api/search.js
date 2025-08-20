export default async function handler(req, res) {
  const { question } = req.body;

  const response = await fetch("https://api.bing.microsoft.com/v7.0/search?q=" + encodeURIComponent(question), {
    headers: { "Ocp-Apim-Subscription-Key": process.env.BING_KEY }
  });

  const data = await response.json();

  const results = data.webPages.value.slice(0, 3).map(r => ({
    title: r.name,
    url: r.url,
    snippet: r.snippet
  }));

  res.status(200).json({ results });
}
