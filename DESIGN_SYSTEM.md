# Curtus Design System & UI Engineering Reference

This document serves as the comprehensive design system reference for Curtus. It outlines the visual, mechanical, and interactive design philosophies that create the signature "premium feel" across the application. Use this guide to maintain consistency, replicate visual depth, and build high-fidelity animations.

---

## 1. Dimensionality & Surface Physics

Premium interfaces rely on layers of physical materiality, texture, and light diffusion to feel premium. Curtus builds this feel through a combination of three key visual elements:

### A. The Textured Glassmorphic Grid
Every primary panel uses a textured, semi-transparent backing that floats on top of the base canvas.
*   **The Blueprint Hatch (`--app-hatch`)**: A technical diagonal hatching pattern drawn at a $-48^\circ$ tilt. It mimics blueprint drafting grids:
    *   **Light Mode**: `repeating-linear-gradient(-48deg, rgb(22 25 37 / 0.02) 0px, rgb(22 25 37 / 0.02) 1px, transparent 1px, transparent 11px)`
    *   **Dark Mode**: `repeating-linear-gradient(-48deg, rgb(255 255 255 / 0.018) 0px, rgb(255 255 255 / 0.018) 1px, transparent 1px, transparent 11px)`
*   **Tactile Paper Grain (`--panel-texture-image`)**: A custom, low-opacity noise texture added to card surfaces. This eliminates sterile, flat digital blocks and mimics premium paper stock:
    ```css
    /* Light Mode (Opacity: 5.5%, baseFrequency: 0.78) */
    --panel-texture-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E");

    /* Dark Mode (Opacity: 3.5%, baseFrequency: 0.65) */
    --panel-texture-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    ```

### B. Layered Shadows & Inset Highlights
Avoid solid borders on floating surfaces. Hard lines trap light and make cards look flat.
*   **Warm Ambient Shadows (Light Mode)**: Instead of neutral grays, shadows are mixed with a warm amber/brown hue (`rgb(112 82 62)`) to mimic incandescent desk lighting:
    *   **Small Lift (`--shadow-ambient-sm`)**: `0 1px 2px rgb(22 25 37 / 0.034), 0 16px 42px rgb(112 82 62 / 0.048)`
    *   **Medium Lift (`--shadow-ambient-md`)**: `0 2px 5px rgb(22 25 37 / 0.032), 0 26px 58px rgb(118 88 66 / 0.058)`
    *   **Floating Cards (`--shadow-float`)**: `0 1px 2px rgb(22 25 37 / 0.038), 0 18px 48px rgb(108 82 62 / 0.062), inset 0 1px 0 rgb(255 255 255 / 0.36)`
*   **Luminous Outlines (Dark Mode)**: Shadows do not show on deep backgrounds. Define edges with light leakage (white rings with low opacity):
    *   **Ambient Shadow**: `0 1px 3px rgb(0 0 0 / 0.2), 0 16px 44px rgb(0 0 0 / 0.24)`
    *   **Luminous Ring**: `inset 0 1px 0 rgb(255 255 255 / 0.045)`

### C. OKLCH Color Space
Colors are declared using the OKLCH space (e.g. `oklch(L C H)`). This ensures uniform perceptual brightness when translating between color palettes and keeps pastel/vibrant gradients from passing through "muddy gray" areas.

---

## 2. Navigational Ergonomics

Navigation is divided based on intention: immediate toolbar control vs. application-wide shortcuts.

### A. The Top Dashboard Navbar
*   **Role**: Displays context-specific indicators (like study timers, toggles, and user profiles) without blocking screen space.
*   **Styling**: Compact bar with a translucent container backing:
    ```css
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    ```

### B. The Interactive Floating Dock
*   **Role**: Provides quick-jump buttons that sit floatingly at the bottom center of the viewport.
*   **Interactive Magnification (Desktop Only)**: Replicates the classic physical magnification dock. Moving the cursor over the dock scales items up smoothly and translates them vertically depending on how close they are to the mouse pointer.
*   **Dynamic Hover Spring Physics**:
    *   `stiffness: 320`
    *   `damping: 24`
    *   `mass: 0.35`
*   **Vanilla JS Computation Example**:
    ```javascript
    function updateDockMagnification(mouseX) {
      const icons = document.querySelectorAll('.dock-icon');
      const maxDistance = 140; // Pixel radius of influence

      for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const distance = mouseX - iconCenterX;

        if (Math.abs(distance) < maxDistance) {
          const pct = Math.abs(distance) / maxDistance;
          // Scale from 1.3 (closest) down to 1.0 (far away)
          const scale = 1.3 - (0.3 * pct);
          // Lift up to -8px (closest) down to 0px (far away)
          const translateY = -8 * (1.0 - pct);

          icon.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        } else {
          icon.style.transform = 'scale(1) translateY(0px)';
        }
      }
    }
    ```

---

## 3. Staggered Reveals & Animation Guidelines

All interface entry animations must feel organic and liquid. Avoid showing a page in one single hard frame load.

### A. Staggered Reveals
*   **Break Content Semantically**: Split the screen layout into smaller chunks (headings, primary cards, sidebar rows).
*   **Parameters**:
    *   **Stagger Step**: $36\text{ms}$ delay per succeeding sibling item (`staggerChildren: 0.036`).
    *   **Entrance Duration**: $220\text{ms}$ (`medium` duration) using a smooth ease-out curve.
*   **Combine Transformations**: Never animate opacity alone. Always shift, fade, and clear blur at the same time:
    *   `initial: { opacity: 0, x: -8, filter: "blur(3px)" }`
    *   `animate: { opacity: 1, x: 0, filter: "blur(0px)" }`

### B. Exit Speed & Deceleration
Exits should be softer, quieter, and faster than entrances so they do not compete for the user's attention.
*   **Parameters**:
    *   **Exit Duration**: $180\text{ms}$ (`fast` duration).
    *   **Exit Move**: Shorter offset values to prevent dramatic screen movement (e.g. `x: -6` instead of `x: -12`).
    *   `exit: { opacity: 0, x: -6, filter: "blur(3px)" }`

### C. Zero-Bounce Icon Swaps
Swapping icons (e.g., sound mute/unmute, play/pause) must feel rapid and mechanical, not soft or playful.
*   **Values**:
    *   `scale`: $0.25 \to 1.0$
    *   `opacity`: $0.0 \to 1.0$
    *   `filter`: `blur(4px)` $\to$ `blur(0px)`
*   **Spring Formula**: Keep bounce strictly at `0` for UI icons.
    *   `stiffness: 420`, `damping: 34`, `mass: 0.55`, `bounce: 0`

---

## 4. Architectural Geometry

### A. Concentric Border Radii
When nesting boxes (like buttons inside cards), the outer corner's radius must align with the inner corner's radius to maintain visual consistency.
*   **Formula**:
    $$\text{Outer Radius} = \text{Inner Radius} + \text{Padding}$$
*   **Vanilla CSS Example**:
    ```css
    .card {
      border-radius: 20px; /* 12px inner radius + 8px padding */
      padding: 8px;
    }
    .card-inner-element {
      border-radius: 12px;
    }
    ```

### B. Optical Center Offsets
Geometric centering is mathematically correct but looks visually wrong on asymmetrical shapes.
*   **Play Triangle Icons**: Triangular shapes have more visual weight on their left side. Push play icons slightly right:
    ```css
    .play-icon {
      transform: translateX(1px); /* Optically balanced */
    }
    ```
*   **Buttons with Icons**: The icon-side margin must have slightly less padding than the text-side margin to prevent the icon from feeling pushed away.
    *   **Formula**: $\text{Icon Padding} = \text{Text Padding} - 2\text{px}$
    *   *Tailwind*: `pl-4 pr-3.5 flex items-center gap-2` (left has 16px, right has 14px).

### C. Image Edge Isolation
Images need crisp boundaries to blend cleanly across varied background panels.
*   **Rule**: Apply a `1px` solid outline set to pure black in light mode, and pure white in dark mode. Never use themed neutrals (like slate or zinc).
    *   **Light Mode**: `outline: 1px solid rgba(0, 0, 0, 0.1); outline-offset: -1px;`
    *   **Dark Mode**: `outline: 1px solid rgba(255, 255, 255, 0.1); outline-offset: -1px;`
    *   *Why*: Inset outlines (`outline-offset: -1px`) do not alter layout dimensions, and neutral opacity values prevent "muddy" edges.

---

## 5. Typographic Principles

*   **macOS Rendering (`antialiased`)**: Apply font-smoothing to the root layout tag so text renders thin and crisp on macOS:
    ```css
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    ```
*   **Orphan Prevention**: Add `text-wrap: pretty` to body text. This dynamically adjusts wrapping to ensure the last line doesn't display a single, orphaned word.
*   **Heading Balance**: Use `text-wrap: balance` for titles and subtitles (6 lines or less) to distribute line-wrap lengths symmetrically.
*   **Tabular Numbers**: Use monospaced digits for clocks, timers, and live counters. This keeps character widths static and prevents visual layout shifting when numbers update:
    ```css
    .timer-clock {
      font-variant-numeric: tabular-nums;
    }
    ```

---

## 6. Micro-Feedback

*   **Press Scale Thresholds**: Clicking buttons should give instantaneous physical feedback. Scale down exactly to `0.96` on touch/click. 
    *   **Rule**: Never use scale values lower than `0.95` (which makes buttons feel unstable).
    *   *Tailwind*: `active:scale-[0.96] transition-transform duration-150 ease-out`
*   **Minimum Hit Areas**: Ensure all interactive controls have a touch-target size of at least $40 \times 40\text{px}$. If the visual icon is smaller (e.g. $18 \times 18\text{px}$ checkbox), extend its click target using transparent absolute overlays.
