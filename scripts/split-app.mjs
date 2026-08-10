import fs from "fs";
import path from "path";

const src = fs.readFileSync("estudio-pizzas.jsx", "utf8");
const lines = src.split(/\r?\n/);
const slice = (a, b) => lines.slice(a - 1, b).join("\n");

const root = "src";
for (const d of ["data", "lib", "components", "modes"]) {
  fs.mkdirSync(path.join(root, d), { recursive: true });
}

fs.writeFileSync(
  path.join(root, "data/constants.js"),
  `export const CUP = {
  blue: "#2E86DE",
  green: "#27AE45",
  red: "#E03A2F",
  orange: "#F39C12",
  yellow: "#F5D410",
  white: "#FFFFFF",
};

export const BASE_INGS = ["Pizza Sauce", "Mozzarella", "Dough"];
export const B = null;

export const SECTIONS = [
  { label: "SECCIÓN 1", desc: "Primera estación de la línea: salsa o base, queso y proteínas principales." },
  { label: "SECCIÓN 2", desc: "Segunda estación: vegetales y toppings del medio." },
  { label: "SECCIÓN 3", desc: "Tercera estación: los toques finales. De aquí la pizza entra al horno." },
  { label: "DESPUÉS DE HORNEAR Y CORTAR", desc: "Se agrega fuera del horno, con la pizza ya cortada." },
];

export const ACCENT = "#E04A22";
export const CHEESE = "#E8A838";
export const DISPLAY = "'Oswald','Arial Narrow',sans-serif";
export const BODY = "'Source Sans 3','Segoe UI',sans-serif";
`
);

const iconBlock = slice(19, 86).replace(/^const ICON = /, "export const ICON = ");
const esBlock = slice(88, 116).replace(/^const ES = /, "export const ES = ");
fs.writeFileSync(path.join(root, "data/i18n.js"), `${iconBlock}\n\n${esBlock}\n`);

const pizzasBlock = slice(125, 289).replace(/^const PIZZAS = /, "export const PIZZAS = ");
fs.writeFileSync(
  path.join(root, "data/pizzas.js"),
  `import { B } from "./constants.js";\n\n${pizzasBlock}\n\nexport const fullBuild = (p) => (p.afterCut ? [...p.build, ...p.afterCut] : p.build);\n`
);

const menuBlock = slice(301, 573)
  .replace(/^const PASTA_NOTE = /, "export const PASTA_NOTE = ")
  .replace(/^const PASTAS = /, "export const PASTAS = ")
  .replace(/^const SUB_NOTE = /, "export const SUB_NOTE = ");
fs.writeFileSync(path.join(root, "data/menu.js"), `${menuBlock}\n`);

fs.writeFileSync(
  path.join(root, "data/index.js"),
  `export { CUP, BASE_INGS, B, SECTIONS, ACCENT, CHEESE, DISPLAY, BODY } from "./constants.js";
export { ICON, ES } from "./i18n.js";
export { PIZZAS, fullBuild } from "./pizzas.js";
export { PASTA_NOTE, PASTAS, SUB_NOTE } from "./menu.js";
`
);

// theme.js
const themes = slice(581, 600).replace(/^const THEMES = /, "export const THEMES = ");
fs.writeFileSync(
  path.join(root, "theme.js"),
  `import { createContext, useContext } from "react";\n\n${themes}\n\nexport const ThemeCtx = createContext(THEMES.light);\nexport const useT = () => useContext(ThemeCtx);\n`
);

// lib/storage.js
fs.writeFileSync(
  path.join(root, "lib/storage.js"),
  `export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin espacio o modo privado */ }
}
`
);

// lib/audio.js
fs.writeFileSync(
  path.join(root, "lib/audio.js"),
  `let audioCtx = null;
function tone(freq, start, dur, type, vol) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, audioCtx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(audioCtx.currentTime + start);
  o.stop(audioCtx.currentTime + start + dur);
}
export function feedback(ok, soundOn) {
  if (soundOn) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (ok) { tone(660, 0, 0.09, "sine", 0.12); tone(880, 0.09, 0.14, "sine", 0.12); }
      else { tone(180, 0, 0.22, "square", 0.08); }
    } catch { /* sin soporte de audio */ }
  }
  if (navigator.vibrate) navigator.vibrate(ok ? 25 : [90, 50, 90]);
}
`
);

// lib/shuffle.js
fs.writeFileSync(
  path.join(root, "lib/shuffle.js"),
  `export function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
export function sample(a, n) { return shuffle(a).slice(0, n); }
`
);

console.log("phase1 data/theme/lib written");
