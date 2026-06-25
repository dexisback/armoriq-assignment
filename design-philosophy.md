# Design System & UI/UX Philosophy Guide

This document defines the core visual language, styling guidelines, typography rules, and interactive motion systems developed for **Gaspy**. It is designed to act as a system prompt/context guide for LLMs or developers to replicate this exact level of design premiumness, tactile feel, and dynamic response in future projects.

---

## 1. Design Aesthetics & Philosophy
The project breaks away from flat, generic minimal designs by combining **organic clay/beige warm tones** with a **digital-native electric lime green accent** and **tactile textures**. The interface feels physical (utilizing noise grain, dual-layer dot grids, and 3D layered button shadows) yet highly kinetic (using spring-based responsive animations).

### Key Pillars:
1. **Tactile Textures:** Digital screens feel flat; this design uses SVG grain filters and layered dot grids to create physical texture.
2. **Physics-Driven Motion:** We avoid simple linear animations. Dynamic elements use spring physics (overshoot and settle) and follow physical laws of inertia.
3. **High Contrast Highlights:** A single highly-saturated accent color (`#C5F80A`) is used sparingly but purposefully (active indicators, focus rings, call-to-actions, visual anchors).
4. **Anti-Flat Depth:** Surfaces use Concentric Radius rules, semi-transparent borders, and multi-layered shadows to establish clear elevations.

---

## 2. Color Palette & CSS Variable Tokens
We use CSS variables mapped under Tailwind CSS v4's `@theme` to power light and dark modes. Semi-transparent borders ensure layout elements blend seamlessly with textured backgrounds.

```css
:root {
  /* Earthy Clay Theme */
  --background: #ede4df;          /* Warm beige/sand body */
  --foreground: #1c1917;          /* Stone-900 */
  --card: #f5ede8;                /* Slightly lighter warm panel */
  --card-foreground: #1c1917;
  --muted: #e0d7d2;
  --muted-foreground: #78716c;    /* Stone-500 */
  
  /* Cyber Electric Accent */
  --accent: #C5F80A;              /* Lime green/neon yellow */
  --accent-foreground: #171717;
  --ring: #C5F80A;
  
  /* Glass/Overlay Details */
  --border: rgba(0, 0, 0, 0.08);   /* Alpha borders let dot grids peak through */
  --popover: rgba(255, 250, 247, 0.98);
  
  /* Surface Texture Background */
  --panel-texture-bg: #f5ede8;
  --panel-texture-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
}

.dark {
  /* Dark Cyber-Earthy Theme */
  --background: #0c0b0a;          /* Charcoal stone black */
  --foreground: #f0efee;          /* Soft off-white */
  --card: #1c1a18;                /* Stone panel */
  --card-foreground: #f0efee;
  --muted: #282522;
  --muted-foreground: #9c9894;
  
  /* Cyber Electric Accent */
  --accent: #C5F80A;
  --accent-foreground: #171717;
  --ring: #C5F80A;
  
  /* Glass/Overlay Details */
  --border: rgba(255, 255, 255, 0.10);
  --popover: rgba(28, 26, 24, 0.98);
  
  /* Surface Texture Background */
  --panel-texture-bg: #1c1a18;
  --panel-texture-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
}
```

---

## 3. Advanced Texturing System
The tactile quality comes from combining dual-layer background patterns and CSS/SVG noise overlays:

### Body Dual-Layer Dot Grid
Applied directly to the body to establish a structure. It overlaps a frequent dark dot grid with a sparse, offset warm/accent tinted grid:
```css
body {
  background-color: var(--background);
  background-image:
    /* Layer 1: Small, frequent grid dots */
    radial-gradient(circle, rgba(0, 0, 0, 0.18) 1.2px, transparent 1.2px),
    /* Layer 2: Sparse, larger warm offset grid dots */
    radial-gradient(circle, rgba(200, 160, 120, 0.32) 1.5px, transparent 1.5px);
  background-size: 20px 20px, 80px 80px;
  background-position: 0 0, 14px 24px;
}

.dark body {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.22) 1.2px, transparent 1.2px),
    radial-gradient(circle, rgba(197, 248, 10, 0.35) 1.5px, transparent 1.5px);
  background-size: 20px 20px, 80px 80px;
  background-position: 0 0, 14px 24px;
}
```

### Textured Surface Cards (`.app-surface`)
Cards and sidebars do not use flat backgrounds. They stack an internal subtle dot grid on top of an SVG `fractalNoise` turbulence image data URI:
```css
.app-surface {
  background-color: var(--panel-texture-bg);
  background-image:
    /* Subtle concentric grid dots */
    radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
    /* SVG Noise Grain */
    var(--panel-texture-image);
  background-size: 16px 16px, 200px 200px;
  background-position: 0 0, 0 0;
}

.dark .app-surface {
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    var(--panel-texture-image);
}
```

---

## 4. Typography & Layout Metrics
Typography structure uses modern, fluid rules to make interfaces scan cleanly and read effortlessly.

### 1. Tabular Figures (`font-tabular`)
All numbers inside tables, timelines, stats boards, and graphs must use tabular formatting. This ensures numerals align vertically in columns and prevents layouts from "jittering" horizontally when data counts tick up or down.
* **CSS Class:** `font-variant-numeric: tabular-nums;`

### 2. Text Wrapping Balance (`text-balance` & `text-pretty`)
* **Headings (`<h1>` to `<h3>`):** Use `text-wrap: balance;` to ensure heading text wraps evenly across lines without leaving single-word hangers.
* **Body/Prose Paragraphs:** Use `text-wrap: pretty;` to instruct the layout engine to avoid typographic orphans at the end of text blocks.

### 3. Concentric Radii Rule
When nesting cards inside panels, the inner card's border radius should match the outer container's radius adjusted by the padding. This prevents awkward visual spacing.
* **Formula:** `innerRadius = outerRadius - padding`
* **Tailwind implementation example:** Outer container has `rounded-2xl` (16px) with `p-3` (12px padding), inner child should have `rounded-md` (4px).

---

## 5. Subtle Microinteractions & Physics
Microinteractions make a UI feel responsive and high-fidelity. We avoid linear timers, preferring spring physics and kinetic transitions.

### 1. 3D Tactile Buttons (`.app-btn-3d`)
Tactile buttons use a 6-layer shadow configuration (consisting of drop-shadows, inset bevel borders, and sub-pixel lines) to stand out:
```css
.app-btn-3d {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),             /* Outer sub-pixel border */
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),     /* Inner highlight border */
    inset 0 1px 0 rgba(255, 255, 255, 0.12),       /* Bevel top edge highlight */
    0 1px 2px rgba(0, 0, 0, 0.04),                 /* Soft drop shadow layer 1 */
    0 2px 4px rgba(0, 0, 0, 0.03),                 /* Soft drop shadow layer 2 */
    0 4px 8px rgba(0, 0, 0, 0.02);                 /* Soft drop shadow layer 3 */
}

.dark .app-btn-3d {
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.1);
}
```
* **Tap response:** Every tactile button uses a scale-down interaction upon being pressed.
  `whileTap={{ scale: 0.96 }}`

### 2. Spring Physics Parameters
We use Framer Motion springs to simulate natural weight and bounce.
* **Standard Drawer / Overlay Tray:** Swift animation with low bounce.
  `stiffness: 500`, `damping: 28`, `mass: 0.6`
* **List Entry / Panels:** Soft spring entry.
  `stiffness: 300`, `damping: 28`, `delay: staggered`
* **Mascot Face / Pupils:** Snappy responsive springs to track input.
  `stiffness: 250`, `damping: 20`

### 3. Drag-and-Drop Wobble Feedback
When files are dragged over dropzones (`dragOver`), the component enters an active, infinite loop of slight scaling and jiggling (alternating rotation variants) combined with an accent highlight.
```typescript
animate={
  dragOver
    ? {
        rotate: [0, -1.5, 1.5, -1, 1, 0],
        scale: 1.02,
        borderColor: "rgba(197, 248, 10, 0.6)",
      }
    : { rotate: 0, scale: 1, borderColor: "rgba(0, 0, 0, 0.06)" }
}
transition={
  dragOver
    ? {
        rotate: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
        scale: { duration: 0.2 },
        borderColor: { duration: 0.2 },
      }
    : { duration: 0.2 }
}
```

### 4. Delete sweep Animation (Slice Sweep)
Before removing items from a list, rather than letting them pop out instantly or fade out simply, a light sweep is played across the horizontal axis of the item, followed by list row exit transitions:
```typescript
// On item delete click:
const [slicedId, setSlicedId] = useState<string | null>(null);

async function handleDelete(id: string) {
  setSlicedId(id); // Triggers the overlay light sweep sweep
  setTimeout(() => {
    setSlicedId(null);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, 240); // Matches the exit duration
}

// Inside the row component:
<AnimatePresence>
  {slicedId === item.id && (
    <motion.span
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 0.9, x: 150 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: [0, 0, 0.58, 1] }}
      className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/0 via-white/70 to-white/0"
    />
  )}
</AnimatePresence>
```

---

## 6. Dynamic Vector SVGs & Mascot Tracking
For illustrations and mascots, we write custom inline SVGs directly inside React. This allows us to dynamically manipulate path attributes and internal shape positions using state and mouse trackers.

### 1. Interactive Eyebrow Shapes
We interpolate paths (`d`) directly inside an SVG component using coordinate mathematics based on mouse proximity.
* **Proximity zones:**
  * Close proximity (`distance < 160`): Happy face. Eyebrow curves upward (`d="M11 12.5Q16.5 10 22 12"`).
  * Medium proximity (`distance < 420`): Confused face. Eyebrow flattens (`d="M11 16L22 16"`).
  * Far proximity (default): Sad face. Eyebrow curves downward (`d="M11 20.5Q16.5 23.5 22 20.5"`).

### 2. Spring-Damped Pupil Tracking
We map the global window pointer coordinates into local coordinates offset from the center of the mascot's eyes, then feed these offsets into a Framer Motion `useSpring` hook.
```typescript
const pupilX = useSpring(0, { stiffness: 250, damping: 20 });
const pupilY = useSpring(0, { stiffness: 250, damping: 20 });

// Inside mouse move event handler:
const rect = containerRef.current.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const dx = e.clientX - centerX;
const dy = e.clientY - centerY;
const distance = Math.sqrt(dx * dx + dy * dy);

const maxPupilOffset = 2; // Keep pupil within the iris circle
const angle = Math.atan2(dy, dx);
const pupilDist = Math.min(distance / 60, maxPupilOffset);

pupilX.set(Math.cos(angle) * pupilDist);
pupilY.set(Math.sin(angle) * pupilDist);

// Render inside SVG:
<g transform="translate(16.5, 23)">
  <ellipse cx="0" cy="0" rx="2.6" ry="2.1" fill="#171916" /> {/* Iris */}
  <motion.ellipse
    cx="0" cy="0" rx="0.85" ry="0.85" fill="#F2F4F5"        /* Pupil Highlight */
    style={{ x: pupilX, y: pupilY }}
  />
</g>
```

---

## 7. Interactive Trays & Bottom Drawers
For dashboards or preview features, we implement hidden slide-up trays that rest in a minimised state at the bottom of the screen (`y: 390`) and spring up cleanly when hovered (`whileHover={{ y: 170 }}`).
* **Transition Settings:**
  ```typescript
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 28,
    mass: 0.6,
  }}
  ```
This provides a fluid, tactile peek mechanic that is responsive and does not require explicit toggle clicks.
