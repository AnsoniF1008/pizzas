import fs from "fs";

const uiPath = "src/components/ui.jsx";
let ui = fs.readFileSync(uiPath, "utf8");
// Fix broken exports from PowerShell $1 expansion
ui = ui.replace(/export function \(\{ name, size = 22 \}\)/, "export function Ing({ name, size = 22 })");
ui = ui.replace(/export function \(\{ value, big = false \}\)/, "export function Amount({ value, big = false })");
ui = ui.replace(/export function \(\{ size, setSize \}\)/, "export function SizeToggle({ size, setSize })");
ui = ui.replace(/export function \(\{ idx \}\)/, "export function SectionHeader({ idx })");
ui = ui.replace(
  /export function \(\{ pizza, size, animate = false, show = true, sections = true \}\)/,
  "export function BuildList({ pizza, size, animate = false, show = true, sections = true })"
);
// Ensure remaining plain functions are exported
for (const name of ["Ing", "Amount", "SizeToggle", "SectionHeader", "BuildList", "MiniPizza"]) {
  ui = ui.replace(new RegExp(`(?<!export )function ${name}\\(`, "g"), `export function ${name}(`);
}
fs.writeFileSync(uiPath, ui);
console.log("ui exports:", [...ui.matchAll(/export function (\w+)/g)].map((m) => m[1]).join(", "));

const fixes = [
  ["src/modes/Cortes.jsx", "Cortes"],
  ["src/modes/Examen.jsx", "Examen"],
  ["src/modes/Pastas.jsx", "Pastas"],
];
for (const [file, name] of fixes) {
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(new RegExp(`(?<!export )function ${name}\\(`), `export function ${name}(`);
  fs.writeFileSync(file, s);
  console.log("fixed", file);
}
