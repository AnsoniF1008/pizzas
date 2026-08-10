---
name: pizza-trainer
description: >-
  Domain skill for the Pizza Trainer study app (Sección 1 building charts,
  pastas/menu, cortes, exam modes). Use when editing recipes, portion cups,
  afterCut toppings, study modes (Repaso/Tarjetas/Orden/Examen), menu items,
  cut diagrams, progress stats, PWA/Firebase deploy, or bilingual ES/EN labels.
---

# Pizza Trainer

App de estudio para armar las pizzas de la Sección 1 (más menú y cortes). Stack: React 18 + Vite, un entry `src/main.jsx`, deploy Firebase Hosting (`pizzas-y-mas`).

## Producto

Modos: **Repaso**, **Tarjetas**, **Orden**, **Examen**, **Menú** (pastas/ensaladas/sándwiches), **Cortes**, **Progreso**. Enlace a juego 3D en `/3d/`.

Tamaños: `"10"` y `"14"`. Persistencia localStorage: `pt-theme`, `pt-sound`, `pt-stats`.

## Modelo de datos (pizzas)

Cada pizza en `src/data/pizzas.js`:

- `name`, `sec: [n1, n2]` — filas de Sección 1 / 2; el resto es Sección 3.
- `build`: filas `[ingrediente, valor10, valor14]`
- `afterCut` (opcional): pasos **después** de hornear y cortar.
- `note` (opcional): tip operativo.

Valores de celda:

| Forma | Significado |
|-------|-------------|
| `number` | Piezas contadas |
| `[color, n]` | `n` vasitos del color |
| `[[c,n],[c,n]]` | Mezcla de vasitos |
| `string` | Medida libre (`"pizca"`, `"2 oz"`, …) |
| `null` (`B`) | Base sin medir |

Colores de vaso (`CUP`): `blue`, `green`, `red`, `orange`, `yellow`, `white`.

`BASE_INGS` = `Pizza Sauce`, `Mozzarella`, `Dough` — ocultos en previews/opciones de examen.

`fullBuild(p)` = `build` + `afterCut`.

## Reglas de negocio

- Big Don's Mix = mezcla de carnes (salami, sausage, bacon); va en Carnes.
- Parmesan / Chives después del corte cuando el chart lo indica (`afterCut`).
- No inventar cantidades: editar solo contra el building chart / adjuntos del repo.
- UI bilingüe: nombre EN + `ES[ing]` en español.
- Estética cocina real (Oswald + Source Sans 3, acento `#E04A22`); no “AI cream” / purple gradients.

## Estructura de código

```
src/
  main.jsx
  App.jsx
  data/          # pizzas, menu, i18n, constants
  theme.js
  lib/           # storage, audio, shuffle
  components/    # MiniPizza, Ing, Amount, BuildList, …
  modes/         # Repaso, Tarjetas, Ordenar, Examen, Pastas, Cortes, Progreso
```

`estudio-pizzas.jsx` reexporta `App` por compatibilidad.

## Deploy

```bash
npm run build
npx -y firebase-tools@latest deploy --only hosting
```

Hosting sirve `dist/`; PWA en `public/` (`sw.js`, manifest).

## Al cambiar recetas

1. Actualizar datos en `src/data/`, no hardcodear en UI.
2. Verificar `sec` / `afterCut` / tamaños 10" y 14".
3. Smoke: Repaso (detalle), Tarjetas (revelar), Orden (secuencia), Examen.
