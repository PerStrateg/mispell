import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const dist = join(root, "dist");
const entryPoint = join(root, "src", "index.ts");

mkdirSync(dist, { recursive: true });

for (const file of ["mispell.js", "mispell.iife.js", "mispell.esm.js", "mispell.cjs"]) {
  rmSync(join(dist, file), { force: true });
}

await build({
  entryPoints: [entryPoint],
  bundle: true,
  format: "iife",
  globalName: "Mispell",
  outfile: join(dist, "mispell.js"),
  platform: "browser",
  target: "es2020",
  footer: {
    js: "if (typeof window !== \"undefined\") window.Mispell = Mispell;"
  }
});

copyFileSync(join(dist, "mispell.js"), join(dist, "mispell.iife.js"));

await build({
  entryPoints: [entryPoint],
  bundle: true,
  format: "esm",
  outfile: join(dist, "mispell.esm.js"),
  platform: "neutral",
  target: "es2020"
});

await build({
  entryPoints: [entryPoint],
  bundle: true,
  format: "cjs",
  outfile: join(dist, "mispell.cjs"),
  platform: "neutral",
  target: "es2020"
});

console.log("Built dist/mispell.js, dist/mispell.iife.js, dist/mispell.esm.js, dist/mispell.cjs");
