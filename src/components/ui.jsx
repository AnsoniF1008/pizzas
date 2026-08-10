import React from "react";
import { CUP, BASE_INGS, SECTIONS, ACCENT, DISPLAY, ICON, ES } from "../data/index.js";
import { useT } from "../theme.js";

export function MiniPizza({ pizza, size = 56 }) {
  const tops = (pizza.build || []).filter(([n]) => !BASE_INGS.includes(n)).slice(0, 6);
  const colors = {
    "Pepperonis": "#A02818", "Canad. Bacon": "#D4566A", "Ital. Sausage": "#5C3018",
    "Bacon": "#A84820", "Chicken": "#D4A868", "Black Olives": "#1A1A1A",
    "Green Olives": "#6A8030", "Mushrooms": "#C8B090", "Tomatoes": "#C83018",
    "Red Onions": "#9030A8", "Bell Peppers": "#2E8028", "Pineapple": "#E8B020",
    "Spinach": "#1E5820", "Basil": "#2E6828", "Cheddar": "#E88810", "Feta": "#E8E0C8",
    "Big Don's Mix": "#8A4028", "Potatoes": "#D4B848", "Taco Meat": "#5A2810",
  };
  const uid = `pz-${(pizza?.name || "x").replace(/\W/g, "")}-${size}`;
  return (
    <svg className="pt-mini" width={size} height={size} viewBox="0 0 64 64" aria-hidden style={{ display: "block" }}>
      <defs>
        <radialGradient id={`${uid}-crust`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F4D9A0" />
          <stop offset="70%" stopColor="#D4A860" />
          <stop offset="100%" stopColor="#A87838" />
        </radialGradient>
        <radialGradient id={`${uid}-sauce`} cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FF4D1A" />
          <stop offset="100%" stopColor="#8A1808" />
        </radialGradient>
        <filter id={`${uid}-soft`}>
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity=".25" />
        </filter>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#${uid}-crust)`} filter={`url(#${uid}-soft)`} />
      <circle cx="32" cy="32" r="24" fill={`url(#${uid}-sauce)`} />
      <circle cx="32" cy="32" r="22" fill="#F2C85A" opacity=".5" />
      {tops.map((row, i) => {
        const a = (i / Math.max(tops.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const r = 8 + (i % 3) * 4;
        const x = 32 + Math.cos(a) * r;
        const y = 32 + Math.sin(a) * r;
        return <circle key={i} cx={x} cy={y} r={3.2} fill={colors[row[0]] || "#8A6238"} stroke="rgba(0,0,0,.18)" strokeWidth=".4" />;
      })}
    </svg>
  );
}

export function Ing({ name, size = 22 }) {
  const ic = ICON[name] || "•";
  if (ic === "PEP") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="#C0392B" stroke="#8E2A20" strokeWidth="1.2" />
        {[[8, 9], [15, 8], [12, 13], [8, 16], [16, 15]].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="1.6" fill="#7B1E16" />
        ))}
      </svg>
    );
  }
  if (ic === "ART") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3c4 2 6 6 6 10 0 4-3 7-6 7s-6-3-6-7c0-4 2-8 6-10z" fill="#6E8B3D" stroke="#4F6429" strokeWidth="1" />
        <path d="M12 7v12M8 11l4 3 4-3M8 15l4 3 4-3" stroke="#3f521f" strokeWidth="1" fill="none" />
      </svg>
    );
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{ic}</span>;
}

export function Amount({ value, big = false }) {
  const t = useT();
  if (value === null || value === undefined) {
    return (
      <span
        className="font-bold uppercase"
        style={{
          color: t.subtle,
          fontSize: big ? 11 : 10,
          fontFamily: DISPLAY,
          letterSpacing: 1,
          opacity: 0.85,
        }}
      >
        base
      </span>
    );
  }
  if (typeof value === "number") {
    return (
      <span className="font-bold" style={{ fontFamily: DISPLAY, fontSize: big ? 26 : 20, color: t.ink, lineHeight: 1 }}>
        {value}
      </span>
    );
  }
  if (typeof value === "string") {
    return (
      <span className="font-semibold text-right leading-tight" style={{ color: t.ink, fontSize: big ? 14 : 12 }}>
        {value}
      </span>
    );
  }
  const groups = Array.isArray(value[0]) ? value : [value];
  const r = big ? 10 : 8;
  return (
    <span className="inline-flex items-center" style={{ gap: 4 }}>
      {groups.map(([color, n], gi) => (
        <span key={gi} className="inline-flex items-center" style={{ gap: 3 }}>
          {gi > 0 && <span style={{ color: t.muted, fontSize: 11 }}>+</span>}
          {Array.from({ length: n }).map((_, i) => (
            <span
              key={i}
              style={{
                width: r,
                height: r,
                borderRadius: "50%",
                background: CUP[color],
                border: color === "white" ? "1.5px solid #b9b9b9" : "1px solid rgba(0,0,0,.18)",
                display: "inline-block",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)",
              }}
            />
          ))}
        </span>
      ))}
    </span>
  );
}

export function SizeToggle({ size, setSize }) {
  const t = useT();
  return (
    <div
      className="inline-flex p-1"
      style={{ background: t.toggleBg, borderRadius: 10, border: `1px solid ${t.line}` }}
    >
      {["10", "14"].map((s) => {
        const on = size === s;
        return (
          <button
            key={s}
            onClick={() => setSize(s)}
            className="pt-btn px-3.5 py-1.5 text-sm font-bold"
            style={{
              fontFamily: DISPLAY,
              letterSpacing: 0.6,
              borderRadius: 8,
              background: on ? ACCENT : "transparent",
              color: on ? "#FFF6EC" : t.muted,
            }}
          >
            {s}"
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeader({ idx }) {
  const t = useT();
  const s = SECTIONS[idx];
  const colors = [CUP.blue, CUP.green, ACCENT, CUP.red];
  return (
    <div className="flex items-center mt-3 mb-1" style={{ gap: 10 }}>
      <span
        className="flex-shrink-0"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: colors[idx],
          color: "#fff",
          fontFamily: DISPLAY,
          fontSize: 12,
          display: "grid",
          placeItems: "center",
          letterSpacing: 0.5,
        }}
      >
        {idx + 1}
      </span>
      <span className="leading-tight">
        <span className="block font-bold" style={{ fontFamily: DISPLAY, fontSize: 14, letterSpacing: 1, color: t.ink }}>
          {s.label}
        </span>
        <span className="block" style={{ color: t.muted, fontSize: 11 }}>{s.desc}</span>
      </span>
    </div>
  );
}

export function BuildList({ pizza, size, animate = false, show = true, sections = true }) {
  const t = useT();
  const [s1, s2len] = pizza.sec || [pizza.build.length, 0];
  const boundary2 = s1 + s2len;

  const renderRow = (row, i, delayIdx) => {
    const [ing, tt, f] = row;
    const val = size === "10" ? tt : f;
    return (
      <div
        key={`r${i}`}
        className="pt-row flex items-center"
        style={{
          gap: 12,
          padding: "10px 12px",
          borderRadius: 12,
          background: i % 2 ? t.zebra : t.ticket,
          border: `1px solid ${t.line}`,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(8px)",
          transition: animate ? "opacity .35s ease, transform .35s ease" : "none",
          transitionDelay: animate ? `${delayIdx * 55}ms` : "0ms",
        }}
      >
        <span
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: 9,
            background: t.chip,
            border: `1px solid ${t.line}`,
          }}
        >
          <Ing name={ing} size={20} />
        </span>
        <span className="flex-1 leading-tight">
          <span className="font-semibold" style={{ color: t.ink, fontSize: 14.5 }}>{ing}</span>
          <span className="block" style={{ color: t.muted, fontSize: 11.5 }}>{ES[ing]}</span>
        </span>
        <span className="flex items-center justify-end" style={{ minWidth: 54, maxWidth: 130 }}>
          <Amount value={val} />
        </span>
      </div>
    );
  };

  const items = [];
  let delayIdx = 0;
  pizza.build.forEach((row, i) => {
    if (sections) {
      if (i === 0) items.push(<SectionHeader key="h0" idx={0} />);
      if (i === s1 && s2len > 0) items.push(<SectionHeader key="h1" idx={1} />);
      if (i === boundary2 && i < pizza.build.length) items.push(<SectionHeader key="h2" idx={2} />);
    }
    items.push(renderRow(row, i, delayIdx++));
  });
  if (sections && pizza.afterCut) {
    items.push(<SectionHeader key="h3" idx={3} />);
    pizza.afterCut.forEach((row, i) => items.push(renderRow(row, pizza.build.length + i, delayIdx++)));
  }

  return (
    <div className="flex flex-col" style={{ gap: 7 }}>
      {items}
      {sections && pizza.note && (
        <p
          className="px-3 py-2.5 mt-1"
          style={{
            background: t.zebra,
            border: `1px dashed ${t.line}`,
            color: t.muted,
            fontSize: 12.5,
            borderRadius: 12,
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: ACCENT, fontFamily: DISPLAY, letterSpacing: 1, marginRight: 6 }}>TIP</span>
          {pizza.note}
        </p>
      )}
    </div>
  );
}
