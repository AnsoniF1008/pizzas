---
name: whimsy-injector
description: A├▒ade delight y personalidad a interfaces. Usa este skill para microinteractions, easter eggs, loading states creativos, empty states memorables, y momentos de sorpresa que hacen la experiencia memorable.
---

# Whimsy Injector

Especialista en a├▒adir momentos de alegr├¡a y sorpresa a productos digitales. Transforma interacciones funcionales en experiencias memorables. Se activa autom├íticamente despu├⌐s de cambios de UI/UX.

## Cu├índo Usar Este Skill

- A├▒adir microinteractions a componentes
- Crear loading states entretenidos
- Dise├▒ar empty states memorables
- Implementar easter eggs
- Hacer error states menos frustrantes
- Celebrar logros del usuario

## Responsabilidades Principales

### 1. Microinteractions
- A├▒ade feedback visual satisfactorio
- Crea transiciones fluidas entre estados
- Implementa hover effects delightful
- Dise├▒a animaciones de confirmaci├│n
- Hace botones irresistibles de clickear

### 2. Loading & Wait States
- Transforma esperas en entretenimiento
- Crea skeleton screens interesantes
- Dise├▒a progress indicators creativos
- A├▒ade mensajes de espera con personalidad
- Reduce percepci├│n de tiempo de carga

### 3. Empty States
- Convierte vac├¡o en oportunidad
- Gu├¡a usuarios hacia primera acci├│n
- A├▒ade ilustraciones con personalidad
- Incluye copy que hace sonre├¡r
- Motiva a llenar el espacio

### 4. Celebration Moments
- Celebra milestones del usuario
- Crea confetti y animaciones de ├⌐xito
- Reconoce logros de forma memorable
- Hace que usuarios quieran compartir
- Refuerza comportamiento positivo

## Microinteraction Recipes

```tsx
// Like button con bounce
const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      animate={liked ? { scale: [1, 1.2, 1] } : {}}
      onClick={() => setLiked(!liked)}
    >
      <Heart filled={liked} />
    </motion.button>
  );
};

// Toggle switch satisfactorio
const Toggle = ({ checked, onChange }) => (
  <motion.div 
    className="toggle-track"
    animate={{ backgroundColor: checked ? '#10B981' : '#E5E7EB' }}
  >
    <motion.div
      className="toggle-thumb"
      animate={{ x: checked ? 20 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </motion.div>
);

// Button con ripple effect
const RippleButton = ({ children, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={(e) => {
      // Crear ripple en punto de click
      createRipple(e);
      onClick();
    }}
  >
    {children}
  </motion.button>
);
```

## Loading States Creativos

```tsx
// Skeleton con shimmer
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded" />
  <div className="h-4 bg-gray-200 rounded w-5/6" />
</div>

// Mensajes de loading rotativos
const loadingMessages = [
  "Preparando algo especial...",
  "Casi listo...",
  "Vale la pena la espera...",
  "A├▒adiendo un toque de magia...",
];

// Progress con personalidad
<div className="text-center">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    ≡ƒÜÇ
  </motion.div>
  <p className="mt-2 text-sm text-gray-500">
    {loadingMessages[currentMessageIndex]}
  </p>
</div>
```

## Empty States Memorables

```tsx
// Empty inbox
<div className="text-center py-12">
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    ≡ƒô¡
  </motion.div>
  <h3 className="mt-4 text-lg font-medium">
    Inbox Zero Achievement Unlocked!
  </h3>
  <p className="mt-2 text-gray-500">
    No messages yet. Enjoy the silence... for now.
  </p>
</div>

// Empty search results
<div className="text-center py-12">
  <div className="text-6xl">≡ƒöì</div>
  <h3 className="mt-4">No encontramos "{query}"</h3>
  <p className="text-gray-500">
    Pero encontramos estos consejos ├║tiles...
  </p>
</div>

// No data yet
<div className="text-center py-12">
  <motion.div
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    ≡ƒî▒
  </motion.div>
  <h3>Tu jard├¡n de datos est├í vac├¡o</h3>
  <p>Planta tu primera semilla</p>
  <Button>Empezar</Button>
</div>
```

## Celebration Moments

```tsx
// Confetti explosion
import confetti from 'canvas-confetti';

const celebrate = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Achievement unlocked
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  className="achievement-card"
>
  <div className="text-4xl">≡ƒÅå</div>
  <h3>Achievement Unlocked!</h3>
  <p>Completaste tu primer proyecto</p>
</motion.div>

// Streak celebration
const StreakBadge = ({ days }) => (
  <motion.div
    animate={{ 
      boxShadow: ['0 0 20px #FFD700', '0 0 40px #FFD700', '0 0 20px #FFD700']
    }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    ≡ƒöÑ {days} d├¡as seguidos!
  </motion.div>
);
```

## Error States con Empat├¡a

```tsx
// 404 friendly
<div className="text-center">
  <motion.div
    animate={{ x: [-5, 5, -5] }}
    transition={{ duration: 0.5, repeat: Infinity }}
  >
    ≡ƒñ╖ΓÇìΓÖé∩╕Å
  </motion.div>
  <h1>P├ígina no encontrada</h1>
  <p>Parece que esta p├ígina se fue de vacaciones</p>
  <Button>Volver al inicio</Button>
</div>

// Error de conexi├│n
<div className="text-center">
  <div className="text-6xl">≡ƒôí</div>
  <h3>Houston, tenemos un problema</h3>
  <p>Parece que perdimos conexi├│n. ┬┐Probamos de nuevo?</p>
  <Button onClick={retry}>Reintentar</Button>
</div>

// Form error gentil
<motion.div
  initial={{ x: 0 }}
  animate={{ x: [-10, 10, -10, 10, 0] }}
  className="text-red-500 text-sm"
>
  Oops! Este email no parece v├ílido
</motion.div>
```

## Easter Eggs Ideas

```
Konami Code ΓåÆ Unlock special theme
Click logo 7 times ΓåÆ Fun animation
Type "hello" in search ΓåÆ Friendly response
Scroll to very bottom ΓåÆ Hidden message
Hover on mascot ΓåÆ Different expressions
Dark mode toggle ΓåÆ Moon/sun animation
Pull to refresh far ΓåÆ Fun character appears
```

## Whimsy Audit Checklist

```
Interacciones:
- [ ] Buttons tienen feedback satisfactorio
- [ ] Forms celebran submissions exitosos
- [ ] Toggles se sienten "f├¡sicos"
- [ ] Hover states son delightful
- [ ] Transiciones son smooth

Estados:
- [ ] Loading es entretenido
- [ ] Empty states tienen personalidad
- [ ] Errors son emp├íticos
- [ ] Success es celebrado
- [ ] Wait times tienen distracci├│n

Momentos:
- [ ] Primera acci├│n es celebrada
- [ ] Milestones son reconocidos
- [ ] Streaks son motivados
- [ ] Completions son festejados
```

## Cu├índo NO A├▒adir Whimsy

```
Γ¥î Evitar cuando:
- Usuario est├í frustrado (error cr├¡tico)
- Tarea es urgente (checkout, emergencia)
- Contexto es serio (salud, finanzas cr├¡ticas)
- Animaci├│n causa motion sickness
- Impacta performance significativamente

Γ£à A├▒adir cuando:
- Usuario logr├│ algo
- Hay espera inevitable
- Estado vac├¡o necesita motivaci├│n
- Interacci├│n es repetitiva/aburrida
- Momento es casual/exploraci├│n
```

## Mejores Pr├ícticas

1. **Subtlety wins** - Peque├▒os detalles > grandes gestos
2. **Respect preferences** - Ofrecer reduced-motion
3. **Serve the UX** - Whimsy mejora, no distrae
4. **Test with users** - Algunos aman, otros odian
5. **Performance first** - Delightful Γëá slow
6. **Brand aligned** - Whimsy debe sentirse "on brand"

## Filosof├¡a

> "The goal isn't to add funΓÇöit's to remove friction so elegantly that what remains feels like fun."

El objetivo es que usuarios sonr├¡an sin saber por qu├⌐, que la app se sienta "alive", y que interacciones mundanas se vuelvan momentos de joy.
