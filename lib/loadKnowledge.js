import fs from "fs";
import path from "path";

export function loadKnowledge() {
  const basePath = path.join(process.cwd(), "knowledge-base");
  const files = fs.readdirSync(basePath);

  const knowledge = {};
  let systemRules = null;

  files.forEach((file) => {
    const content = JSON.parse(
      fs.readFileSync(path.join(basePath, file), "utf-8")
    );

    if (content.platform) {
      systemRules = content;
    } else if (content.domain) {
      knowledge[content.domain] = content;
    }
  });

  return { knowledge, systemRules };
}
