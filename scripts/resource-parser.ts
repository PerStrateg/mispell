import { readFileSync } from "node:fs";
import type { CharacterRule, DictionaryData, Replacement } from "../src/core/types";

export interface ResourceIssue {
  file: string;
  message: string;
}

export interface ParsedDictionary {
  dictionary: DictionaryData;
  keys: number;
  replacements: number;
  issues: ResourceIssue[];
}

export interface ParsedCommonWords {
  words: string[];
  issues: ResourceIssue[];
}

export interface ParsedRegexRules {
  rules: CharacterRule[];
  issues: ResourceIssue[];
}

interface ObjectEntry {
  key: string;
  value: unknown;
}

export function parseDictionaryFile(file: string): ParsedDictionary {
  const raw = readFileSync(file, "utf8");
  const issues: ResourceIssue[] = [];
  let entries: ObjectEntry[] = [];

  try {
    entries = parseTopLevelObjectEntries(raw);
  } catch (error) {
    issues.push({
      file,
      message: error instanceof Error ? error.message : String(error)
    });
    return {
      dictionary: {},
      keys: 0,
      replacements: 0,
      issues
    };
  }

  const dictionary: DictionaryData = {};
  let replacementCount = 0;

  for (const entry of entries) {
    const key = entry.key.trim();

    if (!key) {
      issues.push({ file, message: "Dictionary key must not be empty" });
      continue;
    }

    if (!Array.isArray(entry.value)) {
      issues.push({ file, message: `Dictionary value for "${key}" must be an array` });
      continue;
    }

    if (!dictionary[key]) {
      dictionary[key] = [];
    }

    const seen = new Set(dictionary[key].map((replacement) => replacement.value));

    for (const rawReplacement of entry.value) {
      const replacement = parseReplacement(file, key, rawReplacement, issues);

      if (!replacement) {
        continue;
      }

      if (!seen.has(replacement.value)) {
        dictionary[key].push(replacement);
        seen.add(replacement.value);
        replacementCount += 1;
      }
    }
  }

  return {
    dictionary,
    keys: entries.length,
    replacements: replacementCount,
    issues
  };
}

export function parseCommonWordsFile(file: string): ParsedCommonWords {
  const issues: ResourceIssue[] = [];
  let data: unknown;

  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    return {
      words: [],
      issues: [{
        file,
        message: error instanceof Error ? error.message : String(error)
      }]
    };
  }

  if (!Array.isArray(data)) {
    return {
      words: [],
      issues: [{ file, message: "Common words JSON must be an array" }]
    };
  }

  const seen = new Set<string>();
  const words: string[] = [];

  for (const value of data) {
    if (typeof value !== "string" || value.trim() === "") {
      issues.push({ file, message: "Common words must be non-empty strings" });
      continue;
    }

    const normalized = value.toLocaleLowerCase();
    if (seen.has(normalized)) {
      issues.push({ file, message: `Duplicate common word "${value}"` });
      continue;
    }

    seen.add(normalized);
    words.push(value);
  }

  return { words, issues };
}

export function parseRegexRulesFile(file: string): ParsedRegexRules {
  const issues: ResourceIssue[] = [];
  let data: unknown;

  try {
    data = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    return {
      rules: [],
      issues: [{
        file,
        message: error instanceof Error ? error.message : String(error)
      }]
    };
  }

  if (!isObject(data) || !Array.isArray(data.rules)) {
    return {
      rules: [],
      issues: [{ file, message: "Regex rules JSON must have a rules array" }]
    };
  }

  const rules: CharacterRule[] = [];

  for (const value of data.rules) {
    if (!isObject(value)) {
      issues.push({ file, message: "Rule must be an object" });
      continue;
    }

    const { id, pattern, replacement, probability, flags } = value;

    if (typeof id !== "string" || id.trim() === "") {
      issues.push({ file, message: "Rule id must be a non-empty string" });
      continue;
    }

    if (typeof pattern !== "string" || pattern.trim() === "") {
      issues.push({ file, message: `Rule "${id}" pattern must be a non-empty string` });
      continue;
    }

    if (typeof replacement !== "string") {
      issues.push({ file, message: `Rule "${id}" replacement must be a string` });
      continue;
    }

    if (probability != null && (typeof probability !== "number" || probability <= 0)) {
      issues.push({ file, message: `Rule "${id}" probability must be positive` });
      continue;
    }

    if (flags != null && typeof flags !== "string") {
      issues.push({ file, message: `Rule "${id}" flags must be a string` });
      continue;
    }

    try {
      new RegExp(pattern, flags ?? "iu");
    } catch (error) {
      issues.push({
        file,
        message: `Rule "${id}" has invalid RegExp: ${
          error instanceof Error ? error.message : String(error)
        }`
      });
      continue;
    }

    rules.push({
      id,
      pattern,
      replacement,
      probability: probability == null ? undefined : probability,
      flags: flags == null ? undefined : flags
    });
  }

  return { rules, issues };
}

function parseReplacement(
  file: string,
  key: string,
  value: unknown,
  issues: ResourceIssue[]
): Replacement | null {
  if (isObject(value)) {
    if ("synonym" in value) {
      issues.push({ file, message: `Unsupported synonym field in "${key}"` });
      return null;
    }

    issues.push({ file, message: `Unsupported replacement object in "${key}"` });
    return null;
  }

  if (!Array.isArray(value)) {
    issues.push({ file, message: `Replacement for "${key}" must be an array` });
    return null;
  }

  if (value.length === 0 || typeof value[0] !== "string" || value[0].trim() === "") {
    issues.push({ file, message: `Replacement for "${key}" must have a value` });
    return null;
  }

  if (value.length > 2) {
    issues.push({ file, message: `Replacement for "${key}" has unsupported fields` });
    return null;
  }

  const weight = value[1] ?? 1;

  if (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0) {
    issues.push({ file, message: `Replacement weight for "${key}" must be positive` });
    return null;
  }

  return {
    value: value[0],
    weight
  };
}

function parseTopLevelObjectEntries(raw: string): ObjectEntry[] {
  const text = raw.replace(/^\uFEFF/u, "");
  let index = skipWhitespace(text, 0);
  const entries: ObjectEntry[] = [];

  if (text[index] !== "{") {
    throw new Error("Dictionary JSON must be an object");
  }

  index = skipWhitespace(text, index + 1);

  if (text[index] === "}") {
    index = skipWhitespace(text, index + 1);
    if (index !== text.length) {
      throw new Error("Unexpected trailing data after object");
    }
    return entries;
  }

  while (index < text.length) {
    if (text[index] !== "\"") {
      throw new Error(`Expected object key at offset ${index}`);
    }

    const key = readString(text, index);
    index = skipWhitespace(text, key.end);

    if (text[index] !== ":") {
      throw new Error(`Expected ":" after key "${key.value}"`);
    }

    index = skipWhitespace(text, index + 1);

    const valueEnd = readValueEnd(text, index);
    const valueText = text.slice(index, valueEnd);
    let value: unknown;

    try {
      value = JSON.parse(valueText);
    } catch (error) {
      throw new Error(
        `Invalid JSON value for key "${key.value}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    entries.push({ key: key.value, value });
    index = skipWhitespace(text, valueEnd);

    if (text[index] === ",") {
      index = skipWhitespace(text, index + 1);
      continue;
    }

    if (text[index] === "}") {
      index = skipWhitespace(text, index + 1);
      if (index !== text.length) {
        throw new Error("Unexpected trailing data after object");
      }
      return entries;
    }

    throw new Error(`Expected "," or "}" at offset ${index}`);
  }

  throw new Error("Unterminated object");
}

function readString(text: string, start: number): { value: string; end: number } {
  let index = start + 1;
  let escaped = false;

  while (index < text.length) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      index += 1;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      index += 1;
      continue;
    }

    if (char === "\"") {
      const source = text.slice(start, index + 1);
      return {
        value: JSON.parse(source) as string,
        end: index + 1
      };
    }

    index += 1;
  }

  throw new Error(`Unterminated string at offset ${start}`);
}

function readValueEnd(text: string, start: number): number {
  let index = start;
  let depth = 0;
  let inString = false;
  let escaped = false;
  let started = false;

  while (index < text.length) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }

      index += 1;
      continue;
    }

    if (char === "\"") {
      inString = true;
      started = true;
      index += 1;
      continue;
    }

    if (char === "{" || char === "[") {
      depth += 1;
      started = true;
      index += 1;
      continue;
    }

    if (char === "}" || char === "]") {
      if (depth === 0) {
        return index;
      }

      depth -= 1;
      index += 1;

      if (depth === 0) {
        return index;
      }

      continue;
    }

    if (depth === 0 && started && (char === "," || /\s/u.test(char))) {
      return index;
    }

    if (!/\s/u.test(char)) {
      started = true;
    }

    index += 1;
  }

  if (depth === 0 && started) {
    return index;
  }

  throw new Error(`Unterminated value at offset ${start}`);
}

function skipWhitespace(text: string, index: number): number {
  while (index < text.length && /\s/u.test(text[index])) {
    index += 1;
  }

  return index;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
