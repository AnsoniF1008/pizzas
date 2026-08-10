import React from "react";
import { DISPLAY } from "../data/index.js";
import { useT } from "../theme.js";

function CutDiagram({ kind, size = 110 }) {
  const t = useT();
  const stroke = t.ink;
  const dash = { stroke, strokeWidth: 1.6, strokeDasharray: "5 4", fill: "none" };
  const solid = { stroke, strokeWidth: 3.5, fill: "none" };
  const R = 46, C = 55;

  if (kind === "calzone-p" || kind === "calzone-l") {
    // media luna
    return (
      <svg width={size} height={size * 0.62} viewBox="0 0 110 68">
        <path d={`M 9 60 A ${R} ${R} 0 0 1 101 60 Z`} {...solid} />
        {kind === "calzone-p" ? (
          <>
            <line x1="40" y1="20" x2="40" y2="60" {...dash} />
            <line x1="47" y1="17" x2="74" y2="60" {...dash} />
          </>
        ) : (
          <>
            <line x1="34" y1="24" x2="34" y2="60" {...dash} />
            <line x1="41" y1="20" x2="55" y2="60" {...dash} />
            <line x1="69" y1="20" x2="55" y2="60" {...dash} />
            <line x1="76" y1="24" x2="76" y2="60" {...dash} />
          </>
        )}
      </svg>
    );
  }

  const lines = [];
  if (kind === "square-1") {
    lines.push([C, C - R, C, C + R, true], [C - R, C, C + R, C, true]);
  } else if (kind === "square-2") {
    [-15, 15].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R, true], [C - R, C + o, C + R, C + o, true]);
    });
  } else if (kind === "square-3") {
    [-23, 0, 23].forEach((o) => {
      lines.push([C + o, C - R, C + o, C + R, true], [C - R, C + o, C + R, C + o, true]);
    });
  } else if (kind === "bread") {
    for (let i = 1; i <= 7; i++) {
      const x = C - R + (i * 2 * R) / 8;
      lines.push([x, C - R, x, C + R, true]);
    }
    lines.push([C - R, C, C + R, C, true]);
  } else if (kind === "triangle-6") {
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a), true]);
    }
  } else if (kind === "triangle-8") {
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 4;
      lines.push([C - R * Math.cos(a), C - R * Math.sin(a), C + R * Math.cos(a), C + R * Math.sin(a), true]);
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 110 110">
      <defs>
        <clipPath id={`clip-${kind}`}><circle cx={C} cy={C} r={R - 1} /></clipPath>
      </defs>
      <circle cx={C} cy={C} r={R} {...solid} />
      <g clipPath={`url(#clip-${kind})`}>
        {lines.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...dash} />
        ))}
      </g>
    </svg>
  );
}

const CUTS = [
  { kind: "square-1", title: 'KIDS · 6"', desc: "Corte cuadrado: 1 corte vertical y 1 horizontal." },
  { kind: "square-2", title: 'PERSONAL · 10"', desc: "Corte cuadrado: 2 cortes verticales y 2 horizontales." },
  { kind: "square-3", title: 'LARGE 14" / XL 16"', desc: "Corte cuadrado: 3 cortes verticales y 3 horizontales." },
  { kind: "calzone-p", title: "CALZONE PERSONAL", desc: "2 cortes. Se sirve con 1 marinara." },
  { kind: "calzone-l", title: "CALZONE GRANDE", desc: "4 cortes. Se sirve con 2 marinaras." },
  { kind: "bread", title: "GARLIC CHEESE BREAD", desc: "7 cortes verticales y 1 horizontal." },
  { kind: "triangle-6", title: "TRIÁNGULO · PERSONAL", desc: "Corte de triángulo (stuffed crust): 6 porciones." },
  { kind: "triangle-8", title: "TRIÁNGULO · LARGE", desc: "Corte de triángulo (stuffed crust): 8 porciones." },
];

export function Cortes() {
  const t = useT();
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="mb-3" style={{ color: t.muted, fontSize: 13 }}>
        Cómo se corta cada producto al salir del horno.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {CUTS.map((c, i) => (
          <div key={i} className="rounded-2xl p-3 text-center flex flex-col items-center"
            style={{ background: t.surface, border: `1px solid ${t.line}` }}>
            <CutDiagram kind={c.kind} />
            <div className="font-bold mt-1" style={{ fontFamily: DISPLAY, fontSize: 14, color: t.ink }}>
              {c.title}
            </div>
            <div style={{ color: t.muted, fontSize: 11.5, lineHeight: 1.3 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: t.surface, border: `1px solid ${t.line}` }}>
        <h3 className="font-bold mb-2" style={{ fontFamily: DISPLAY, fontSize: 16, color: t.ink }}>
          Toques al salir del horno
        </h3>
        <ul className="flex flex-col" style={{ gap: 8, color: t.ink, fontSize: 13.5, lineHeight: 1.4 }}>
          <li>🧀 <b>Parmesano encima:</b> Big Cheesy, Blanco, Margherita, Tuscany y Veggie.</li>
          <li>🌿 <b>Cebollín (chives) encima:</b> Mr. Potato Head.</li>
          <li>🥣 <b>Calzones:</b> personal con 1 marinara, grande con 2 marinaras.</li>
          <li>🧄 <b>Garlic knots, cheese bread y stuffed crust:</b> espolvorear queso parmesano con perejil.</li>
        </ul>
      </div>
    </div>
  );
}
