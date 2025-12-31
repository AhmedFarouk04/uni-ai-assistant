import fs from "fs";
import path from "path";

export function loadKnowledge() {
  const basePath = path.join(process.cwd(), "knowledge-base");
  const files = fs.readdirSync(basePath);

  return files.map((file) => {
    const content = fs.readFileSync(path.join(basePath, file), "utf-8");
    return JSON.parse(content);
  });
}
