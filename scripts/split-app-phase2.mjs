import fs from "fs";
import path from "path";

const src = fs.readFileSync("estudio-pizzas.jsx", "utf8");
const lines = src.split(/\r?\n/);
const slice = (a, b) => lines.slice(a - 1, b).join("\n");

function exportFn(block) {
  return block
    .replace(/^function MiniPizza/, "export function MiniPizza")
    .replace(/^function Ing/, "export function Ing")
    .replace(/^function Amount/, "export function Amount")
    .replace(/^function SizeToggle/, "export function SizeToggle")
    .replace(/^function SectionHeader/, "export function SectionHeader")
    .replace(/^function BuildList/, "export function BuildList")
    .replace(/^function Repaso/, "export function Repaso")
    .replace(/^function Tarjetas/, "export function Tarjetas")
    .replace(/^function Ordenar/, "export function Ordenar")
    .replace(/^function buildQuestions/, "function buildQuestions")
    .replace(/^function Examen/, "export function Examen")
    .replace(/^function Pastas/, "export function Pastas")
    .replace(/^function CutDiagram/, "function CutDiagram")
    .replace(/^function Cortes/, "export function Cortes")
    .replace(/^function Progreso/, "export function Progreso")
    .replace(/^export default function App/, "export default function App");
}

// components
const componentsBody = exportFn(slice(641, 841));
fs.writeFileSync(
  path.join("src", "components", "ui.jsx"),
  `import React from "react";
import { CUP, BASE_INGS, SECTIONS, ACCENT, DISPLAY, ICON, ES } from "../data/index.js";
import { useT } from "../theme.js";

${componentsBody}
`
);

// modes - each file
const modes = [
  {
    file: "Repaso.jsx",
    start: 844,
    end: 937,
    header: `import React, { useState } from "react";
import { PIZZAS, fullBuild, BASE_INGS, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { MiniPizza, Ing, SizeToggle, BuildList } from "../components/ui.jsx";
`,
  },
  {
    file: "Tarjetas.jsx",
    start: 940,
    end: 1003,
    header: `import React, { useState } from "react";
import { PIZZAS, fullBuild, BASE_INGS, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { Ing, SizeToggle, BuildList } from "../components/ui.jsx";
`,
  },
  {
    file: "Ordenar.jsx",
    start: 1006,
    end: 1135,
    header: `import React, { useState, useMemo } from "react";
import { PIZZAS, fullBuild, CUP, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle } from "../lib/shuffle.js";
import { feedback } from "../lib/audio.js";
import { Ing, Amount, SizeToggle } from "../components/ui.jsx";
`,
  },
  {
    file: "Examen.jsx",
    start: 1148,
    end: 1381,
    header: `import React, { useState, useEffect } from "react";
import { PIZZAS, fullBuild, BASE_INGS, CUP, ACCENT, DISPLAY, ICON, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { shuffle, sample } from "../lib/shuffle.js";
import { load, save } from "../lib/storage.js";
import { feedback } from "../lib/audio.js";
import { Ing } from "../components/ui.jsx";
`,
  },
  {
    file: "Pastas.jsx",
    start: 1384,
    end: 1508,
    header: `import React, { useState } from "react";
import { PASTAS, PASTA_NOTE, SUB_NOTE, ACCENT, DISPLAY, ES } from "../data/index.js";
import { useT } from "../theme.js";
import { Ing } from "../components/ui.jsx";
`,
  },
  {
    file: "Cortes.jsx",
    start: 1511,
    end: 1628,
    header: `import React from "react";
import { DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
`,
  },
  {
    file: "Progreso.jsx",
    start: 1631,
    end: 1735,
    header: `import React from "react";
import { PIZZAS, CUP, ACCENT, DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";
`,
  },
];

for (const m of modes) {
  const body = exportFn(slice(m.start, m.end));
  fs.writeFileSync(path.join("src", "modes", m.file), `${m.header}\n${body}\n`);
  console.log("wrote", m.file);
}

// App.jsx
const appBody = exportFn(slice(1738, 1884));
fs.writeFileSync(
  path.join("src", "App.jsx"),
  `import React, { useState, useEffect } from "react";
import { ACCENT, CHEESE, DISPLAY, BODY } from "./data/index.js";
import { THEMES, ThemeCtx } from "./theme.js";
import { load, save } from "./lib/storage.js";
import { Repaso } from "./modes/Repaso.jsx";
import { Tarjetas } from "./modes/Tarjetas.jsx";
import { Ordenar } from "./modes/Ordenar.jsx";
import { Examen } from "./modes/Examen.jsx";
import { Pastas } from "./modes/Pastas.jsx";
import { Cortes } from "./modes/Cortes.jsx";
import { Progreso } from "./modes/Progreso.jsx";

${appBody}
`
);

fs.writeFileSync(
  "estudio-pizzas.jsx",
  `export { default } from "./src/App.jsx";\n`
);

fs.writeFileSync(
  "src/main.jsx",
  `import React from "react";
import ReactDOM from "react-portal/client";
`.replace("react-portal", "react-dom") +
    `
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
);

// fix main properly
fs.writeFileSync(
  "src/main.jsx",
  `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
);

console.log("phase2 done");
