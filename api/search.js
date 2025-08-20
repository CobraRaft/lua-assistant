export default async function handler(req, res) {
  const { question } = req.body;

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(question)}&key=${process.env.GOOGLE_KEY}&cx=${process.env.SEARCH_ENGINE_ID}`
  );

  const data = await response.json();

  const results = data.items ? data.items.slice(0, 3).map(r => ({
    title: r.title,
    url: r.link,
    snippet: r.snippet
  })) : [];

  // petite suggestion auto si ça ressemble à du Roblox
  let code = "";
  if (question.includes("tuer") || question.includes("kill")) {
    code = `-- Script simple pour tuer un joueur quand il marche sur une part
local part = workspace.Part
part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end)`;
  }

  res.status(200).json({ results, code });
}
