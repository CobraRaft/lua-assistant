import fs from "fs";
import path from "path";

const filePath = path.resolve("./base.json");

let base = {};
if (fs.existsSync(filePath)) {
  base = JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { question } = req.body;
    const q = question.toLowerCase();

    for (const key in base) {
      if (q.includes(key)) {
        return res.status(200).json({
          answer: `🚀 **Comment faire : ${key}**\n1. Voici le script Lua prêt à l'emploi 🎉\n\n\`\`\`lua\n${base[key]}\n\`\`\``
        });
      }
    }

    return res.status(200).json({
      answer: "😅 Je ne sais pas encore, mais tu peux m'apprendre ou chercher sur le web !"
    });
  }
}
