export default async function handler(req, res) {
  const { question } = req.body;

  // 🔎 On filtre les recherches pour du contenu Roblox uniquement
  const q = `${question} site:devforum.roblox.com OR site:scriptinghelpers.org OR site:stackoverflow.com`;

  // 🌍 Appel API Google
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&key=${process.env.GOOGLE_KEY}&cx=${process.env.SEARCH_ENGINE_ID}`
  );

  const data = await response.json();

  // 📌 Formatage des résultats (3 max)
  const results = data.items
    ? data.items.slice(0, 3).map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet
      }))
    : [];

  // 💻 Suggestions automatiques de code
  let code = "";

  // 🟥 Kill Part
  if (question.toLowerCase().includes("kill") || question.toLowerCase().includes("tuer")) {
    code = `-- Script pour tuer un joueur quand il touche une part
local part = workspace.Part
part.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end)`;
  }

  // 🟦 Leaderstats
  else if (question.toLowerCase().includes("leaderstats")) {
    code = `-- Script leaderstats simple
game.Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local Money = Instance.new("IntValue")
    Money.Name = "Money"
    Money.Value = 0
    Money.Parent = stats
end)`;
  }

  // 🟩 Tween
  else if (question.toLowerCase().includes("tween")) {
    code = `-- Script Tween pour animer une Part
local TweenService = game:GetService("TweenService")
local part = workspace.Part

local info = TweenInfo.new(
    2, -- durée
    Enum.EasingStyle.Quad,
    Enum.EasingDirection.Out
)

local goal = { Position = Vector3.new(0, 10, 0) }

local tween = TweenService:Create(part, info, goal)
tween:Play()`;
  }

  // 🟨 Datastore
  else if (question.toLowerCase().includes("datastore") || question.toLowerCase().includes("save")) {
    code = `-- Script DataStore pour sauvegarder l'argent
local DataStoreService = game:GetService("DataStoreService")
local ds = DataStoreService:GetDataStore("MoneyData")

game.Players.PlayerAdded:Connect(function(player)
    local stats = Instance.new("Folder")
    stats.Name = "leaderstats"
    stats.Parent = player

    local Money = Instance.new("IntValue")
    Money.Name = "Money"
    Money.Value = ds:GetAsync(player.UserId) or 0
    Money.Parent = stats
end)

game.Players.PlayerRemoving:Connect(function(player)
    local money = player.leaderstats.Money.Value
    ds:SetAsync(player.UserId, money)
end)`;
  }

  // 🟪 Teleport
  else if (question.toLowerCase().includes("teleport")) {
    code = `-- Script de téléportation
local TeleportService = game:GetService("TeleportService")
local placeId = 123456789 -- ID du jeu où téléporter

game.Players.PlayerAdded:Connect(function(player)
    wait(5)
    TeleportService:Teleport(placeId, player)
end)`;
  }

  // 🟧 Badge
  else if (question.toLowerCase().includes("badge")) {
    code = `-- Script pour donner un badge
local BadgeService = game:GetService("BadgeService")
local badgeId = 123456789 -- ID du badge

game.Players.PlayerAdded:Connect(function(player)
    local success, err = pcall(function()
        BadgeService:AwardBadge(player.UserId, badgeId)
    end)
    if not success then
        warn("Erreur badge: "..err)
    end
end)`;
  }

  // 🟫 GUI Button
  else if (question.toLowerCase().includes("button") || question.toLowerCase().includes("gui")) {
    code = `-- Script GUI bouton pour donner de l'argent
local button = script.Parent
button.MouseButton1Click:Connect(function()
    local player = game.Players.LocalPlayer
    player.leaderstats.Money.Value += 10
end)`;
  }

  // 🌐 Default fallback
  else {
    code = `-- Aucun snippet spécifique trouvé.
-- Essaie avec un mot-clé comme : kill, leaderstats, tween, datastore, teleport, badge, gui`;
  }

  // ✅ On renvoie résultats + snippet de code
  res.status(200).json({ results, code });
}
