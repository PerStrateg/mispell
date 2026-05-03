import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import {
  createDistorter,
  distort,
  en,
  generic,
  ru,
  scramble,
  typo
} from "../src";

describe("deterministic distortion", () => {
  it("uses a stable default seed", () => {
    const a = distort("Пример текста", {
      language: ru(),
      profile: typo(),
      intensity: 0.5
    });

    const b = distort("Пример текста", {
      language: ru(),
      profile: typo(),
      intensity: 0.5
    });

    expect(a).toBe(b);
  });

  it("returns the same output for the same explicit seed", () => {
    const options = {
      language: en(),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    };

    expect(distort("beginning library", options)).toBe(
      distort("beginning library", options)
    );
  });

  it("can produce different output for different seeds", () => {
    const text = "beginning beginning beginning";
    const a = distort(text, {
      language: en(),
      profile: typo(),
      intensity: 1,
      seed: "a"
    });
    const b = distort(text, {
      language: en(),
      profile: typo(),
      intensity: 1,
      seed: "b"
    });

    expect(a).not.toBe(b);
  });

  it("keeps intensity zero as a no-op", () => {
    const text = " Hello, world!\nПример 😊 ";

    expect(distort(text, {
      language: ru(),
      profile: typo(),
      intensity: 0,
      seed: "any"
    })).toBe(text);
  });

  it("preserves spaces, newlines, punctuation, and symbols", () => {
    const result = distort("Phone,  houses!\nЁж 😊", {
      language: en({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    });

    expect(result).toContain(",  ");
    expect(result).toContain("!\n");
    expect(result).toContain("😊");
  });
});

describe("profiles", () => {
  it("applies English typo rules", () => {
    expect(distort("phone houses", {
      language: en({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    })).toBe("fone housez");
  });

  it("applies Russian typo rules", () => {
    const result = distort("ёж учится", {
      language: ru({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    });

    expect(result).toContain("еж");
    expect(result).not.toBe("ёж учится");
  });

  it("does not crash for generic typo", () => {
    expect(() => distort("Hellooo world", {
      language: generic(),
      profile: typo(),
      intensity: 1,
      seed: "generic"
    })).not.toThrow();
  });

  it("scrambles English words", () => {
    const result = distort("Architecture is complicated.", {
      language: en(),
      profile: scramble(),
      intensity: 1,
      seed: "stable"
    });

    expect(result).not.toBe("Architecture is complicated.");
    expect(result[0]).toBe("A");
  });

  it("scrambles Russian words", () => {
    const result = distort("архитектура сложная", {
      language: ru(),
      profile: scramble(),
      intensity: 1,
      seed: "stable"
    });

    expect(result).not.toBe("архитектура сложная");
  });
});

describe("API shape", () => {
  it("returns debug operations when requested", () => {
    const result = distort("phone", {
      language: en({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable",
      debug: true
    });

    expect(result.text).toBe("fone");
    expect(result.operations).toHaveLength(1);
    expect(result.operations[0].reason).toBe("character-rule");
  });

  it("returns a string by default", () => {
    const result = distort("phone", {
      language: en({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    });

    expect(typeof result).toBe("string");
  });

  it("selects dictionary replacements", () => {
    const result = distort("beginning", {
      language: en(),
      profile: typo(),
      intensity: 1,
      seed: "dict",
      debug: true
    });

    expect(result.text).not.toBe("beginning");
    expect(result.operations[0].reason).toBe("dictionary");
  });

  it("supports reusable distorters", () => {
    const distorter = createDistorter({
      language: en({ dictionaries: "none" }),
      profile: typo(),
      intensity: 1,
      seed: "stable"
    });

    expect(distorter.text("phone")).toBe("fone");
    expect(distorter.word("houses")).toBe("housez");
  });

  it("exposes window.Mispell in the browser bundle", () => {
    const code = readFileSync(join(process.cwd(), "dist", "mispell.iife.js"), "utf8");
    const context = {
      window: {} as { Mispell?: typeof import("../src") }
    };

    vm.createContext(context);
    vm.runInContext(code, context);

    expect(context.window.Mispell).toBeDefined();
    expect(context.window.Mispell?.distort("phone", {
      language: context.window.Mispell.en({ dictionaries: "none" }),
      profile: context.window.Mispell.typo(),
      intensity: 1,
      seed: "stable"
    })).toBe("fone");
  });
});
