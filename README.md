# mispell

`mispell` is now a minimal deterministic text distortion engine. It takes text, a language adapter, a distortion profile, an intensity, and a seed, then returns the same output for the same inputs every time.

The project is inspired by the original bimbofication library: https://github.com/Gardamuse/mispell

Original-style bimbofication example from `mispell`:

> Thiz aplication transformz text into something dat sundz more like something a "bimbo" might wite. Thiz are done by inserting some wordz with litle meaning like "like", "um" and "baesicly" into uh, reasonable placiez in sentenciez using, like, natural language pwocesing. Wordz are also mispeled using a curated list of mispelingz and some rulez.

This version does not implement the `bimbo` profile yet. The first public profiles are focused on deterministic typos and scrambling.

## Install

```sh
npm i mispell
```

## API

```js
import { distort, ru, typo } from "mispell";

const result = distort("Пример текста", {
  language: ru(),
  profile: typo(),
  intensity: 0.5,
  seed: "stable"
});
```

Reusable distorter:

```js
import { createDistorter, en, scramble } from "mispell";

const distorter = createDistorter({
  language: en(),
  profile: scramble(),
  intensity: 0.7,
  seed: "stable"
});

distorter.text("Architecture is complicated.");
distorter.word("architecture");
```

Browser / userscript usage:

```html
<script src="./dist/mispell.iife.js"></script>
<script>
  const output = Mispell.distort("Hello world", {
    language: Mispell.en(),
    profile: Mispell.typo(),
    intensity: 0.5,
    seed: "demo"
  });
</script>
```

## Exports

```ts
import {
  distort,
  createDistorter,
  en,
  ru,
  generic,
  typo,
  scramble
} from "mispell";
```

Legacy calls were removed:

```txt
bimbofy(text, bf)
scramble(text, bf)
word_complexity(word)
```

`scramble()` is now a profile factory, used as `profile: scramble()`.

## Determinism

No runtime code uses `Math.random()`. If `seed` is omitted, `mispell-default` is used.

```txt
same text + same language + same profile + same intensity + same seed + same resources
= same output
```

Use another `seed` to get another stable variant.

## Languages

First-version language factories:

```js
en()
ru()
generic()
```

`en()` and `ru()` work without heavy NLP dependencies. Optional adapter slots exist for future morphology, NLP, pluralization, noun declension, and name declension integrations.

Dictionary resources are embedded into the browser bundle at build time. You can choose bundled dictionary files:

```js
en({ dictionaries: ["dictionary-birkbeck", "dictionary-wikipedia"] });
ru({ dictionaries: ["dictionary-simple"] });
en({ dictionaries: "all" });
generic();
```

You can also disable bundled dictionaries or pass a custom dictionary:

```js
en({
  dictionaries: "none",
  dictionary: {
    beginning: [{ value: "beggining", weight: 1 }]
  }
});
```

## Profiles

`typo()` applies dictionary replacements and conservative character rules.

`scramble()` targets longer, rarer, more complex words while preserving spaces, newlines, punctuation, symbols, and the original casing style.

## Debug

```js
const debug = distort("phone", {
  language: en({ dictionaries: "none" }),
  profile: typo(),
  intensity: 1,
  seed: "stable",
  debug: true
});

console.log(debug.operations);
```

When `debug` is false or omitted, `distort()` returns a string.

## Build

```sh
npm run validate:resources
npm test
npm run build
```

Build output:

```txt
dist/mispell.js
dist/mispell.iife.js
dist/mispell.esm.js
dist/mispell.cjs
dist/index.d.ts
```

## Todo

- Add `bimbo` as a separate profile.
- Add `casual` profile and phrase fillers.
- Add mixed-language `auto([ru(), en(), generic()])`.
- Add optional Russian and English NLP/morphology adapters.
- Expand curated resources without adding runtime `fs` or `fetch`.
