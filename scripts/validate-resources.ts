import { readdirSync } from "node:fs";
import { basename, join } from "node:path";
import {
  parseCommonWordsFile,
  parseDictionaryFile,
  parseRegexRulesFile,
  type ResourceIssue
} from "./resource-parser";

const root = process.cwd();
const resourcesRoot = join(root, "resources");
const languages = ["en", "ru"] as const;
const issues: ResourceIssue[] = [];
let dictionaryCount = 0;
let replacementCount = 0;
let commonWordCount = 0;
let ruleCount = 0;

for (const language of languages) {
  const languageRoot = join(resourcesRoot, language);
  const commonWords = parseCommonWordsFile(join(languageRoot, "common-words.json"));
  const regexRules = parseRegexRulesFile(join(languageRoot, "regex-rules.json"));
  issues.push(...commonWords.issues, ...regexRules.issues);
  commonWordCount += commonWords.words.length;
  ruleCount += regexRules.rules.length;

  const dictionaryRoot = join(languageRoot, "dictionaries");

  for (const fileName of readdirSync(dictionaryRoot).filter((file) => file.endsWith(".json"))) {
    const dictionaryPath = join(dictionaryRoot, fileName);
    const parsed = parseDictionaryFile(dictionaryPath);
    issues.push(...parsed.issues);
    dictionaryCount += 1;
    replacementCount += parsed.replacements;

    if (parsed.keys === 0) {
      issues.push({
        file: dictionaryPath,
        message: `Dictionary "${basename(fileName, ".json")}" is empty`
      });
    }
  }
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(
  `Resources OK: ${dictionaryCount} dictionaries, ${replacementCount} replacements, ${commonWordCount} common words, ${ruleCount} rules.`
);
