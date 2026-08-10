import { createContext, useContext } from "react";

/**
 * Visual system: night-service pizza line.
 * Charcoal steel + oven heat + ticket paper.
 */
export const THEMES = {
  light: {
    ink: "#14110F",
    onInk: "#FFF6EC",
    paper: "#C8C0B4",
    surface: "#F3EDE3",
    line: "#B7AFA3",
    zebra: "#E8E1D5",
    chip: "#DDD5C8",
    toggleBg: "#CFC6B8",
    muted: "#5E564C",
    subtle: "#746B60",
    faint: "#8A8074",
    header: "#12100E",
    headerSub: "#C9B89A",
    tabBar: "#1A1714",
    tabIdle: "#8A7F70",
    okBg: "#D5EBD8",
    okFg: "#1A5C28",
    badBg: "#F5D9D2",
    badFg: "#8A2418",
    heat: "rgba(255,77,26,.22)",
    steel: "rgba(20,17,15,.06)",
    ticket: "#FFF8EF",
  },
  dark: {
    ink: "#F6EFE4",
    onInk: "#12100E",
    paper: "#0B0A09",
    surface: "#1A1714",
    line: "#3A322A",
    zebra: "#221E19",
    chip: "#2A251F",
    toggleBg: "#322C24",
    muted: "#A89986",
    subtle: "#8F8270",
    faint: "#6F6558",
    header: "#080706",
    headerSub: "#B9A78A",
    tabBar: "#050403",
    tabIdle: "#6A6054",
    okBg: "#163322",
    okFg: "#8AD9A0",
    badBg: "#3A1C16",
    badFg: "#F0A090",
    heat: "rgba(255,77,26,.28)",
    steel: "rgba(255,248,240,.04)",
    ticket: "#221E19",
  },
};

export const ThemeCtx = createContext(THEMES.light);
export const useT = () => useContext(ThemeCtx);
