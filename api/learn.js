import fs from "fs";
import path from "path";

const filePath = path.resolve("./base.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { question, answer } = req.body;

    let base = {};
    if (fs.existsSync(filePath)) {
      base = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    base[question.toLowerCase()] = answer;

    fs.writeFileSync(filePath, JSON.stringify(base, null, 2), "utf-8");

    return res.status(200).json({ status: "ok" });
  }
}
