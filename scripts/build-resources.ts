import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import {
  parseCommonWordsFile,
  parseDictionaryFile,
  parseRegexRulesFile,
  type ResourceIssue
} from "./resource-parser";

const root = process.cwd();
const resourcesRoot = join(root, "resources");
const outputFile = join(root, "src", "generated", "resources.ts");
const languages = ["en", "ru"] as const;

interface BundledResources {
  commonWords: string[];
  characterRules: unknown[];
  dictionaries: Record<string, unknown>;
}

const bundled: Record<string, BundledResources> = {};
const issues: ResourceIssue[] = [];

for (const language of languages) {
  const languageRoot = join(resourcesRoot, language);
  const commonWords = parseCommonWordsFile(join(languageRoot, "common-words.json"));
  const regexRules = parseRegexRulesFile(join(languageRoot, "regex-rules.json"));
  const dictionaries: Record<string, unknown> = {};
  const dictionaryRoot = join(languageRoot, "dictionaries");

  issues.push(...commonWords.issues, ...regexRules.issues);

  for (const fileName of readdirSync(dictionaryRoot).filter((file) => file.endsWith(".json"))) {
    const dictionaryPath = join(dictionaryRoot, fileName);
    const parsed = parseDictionaryFile(dictionaryPath);
    issues.push(...parsed.issues);
    dictionaries[basename(fileName, ".json")] = parsed.dictionary;
  }

  bundled[language] = {
    commonWords: commonWords.words,
    characterRules: regexRules.rules,
    dictionaries
  };
}

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.file}: ${issue.message}`);
  }
  process.exit(1);
}

mkdirSync(join(root, "src", "generated"), { recursive: true });
writeFileSync(
  outputFile,
  `import type { CharacterRule, DictionaryData } from "../core/types";

export interface BundledLanguageResources {
  commonWords: string[];
  characterRules: CharacterRule[];
  dictionaries: Record<string, DictionaryData>;
}

export const bundledResources: Record<string, BundledLanguageResources> = ${JSON.stringify(bundled, null, 2)};
`,
  "utf8"
);

console.log(`Generated ${outputFile}`);
