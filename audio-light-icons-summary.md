# Curtus App Sound, Theme, Typography & Icon System Specification

This document provides a highly detailed design system blueprint for the Curtus application. It is structured to be fed into LLMs or design agents to replicate the exact sound synthesis, color palettes, visual texture, typography rules, and icon paradigms of the app.

---

## 1. Sound System Architecture

The application implements a zero-asset UI sound system by dynamically synthesizing sound effects in real-time using the **Web Audio API** (`AudioContext`). It also includes a hybrid ambient white noise system that falls back to procedural bandpass-filtered noise if CDN assets fail.

### A. Dynamic UI Sound Synthesis
All UI interactions trigger synthesized oscillator waves controlled by volume envelopes (gain ramps).

*   **Audio Engine Envelope Math (`makeEnv`):**
    *   **Attack:** Immediate or tiny linear ramp up to target gain.
    *   **Decay + Release:** Exponential ramp down to `0.0001` over specified seconds to prevent speaker clicking.
    *   *Default envelope structure:*
        ```javascript
        const t = ctx.currentTime + delay;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(targetGain, t + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay + release);
        ```

*   **Synthesis Profiles (Oscillator Types & Frequencies):**
    1.  **Tap/Click (`tap`):**
        *   **Oscillator:** `sine`
        *   **Frequency:** `1300Hz` base
        *   **Frequency Modulation (FM):** Modulated by a second sine wave with `fmRatio: 0.5` and `fmDepth: 100` to create a woody, metallic tick.
        *   **Envelope:** `gain: 0.14`, `attack: 0s`, `decay: 0.015s`, `release: 0.005s`.
    2.  **Toggle On (`toggleOn`):**
        *   **Oscillator:** `sine` (dual ascending note chime)
        *   **Note 1:** `2093Hz` (C7) | `gain: 0.11`, `decay: 0.012s`, `release: 0.004s`.
        *   **Note 2:** `3136Hz` (G7) | `gain: 0.10`, `decay: 0.012s`, `release: 0.004s`, `delay: 0.025s`.
    3.  **Toggle Off (`toggleOff`):**
        *   **Oscillator:** `sine` (dual descending note chime)
        *   **Note 1:** `3136Hz` (G7) | `gain: 0.11`, `decay: 0.012s`, `release: 0.004s`.
        *   **Note 2:** `2093Hz` (C7) | `gain: 0.10`, `decay: 0.012s`, `release: 0.004s`, `delay: 0.025s`.
    4.  **Modal Open (`modalOpen`):**
        *   **Oscillator:** `sine` (exponential frequency sweep upwards)
        *   **Frequency Ramp:** Sweep from `430Hz` to `1400Hz`.
        *   **Envelope:** `gain: 0.09`, `attack: 0s`, `decay: 0.08s`, `release: 0.025s`.
    5.  **Modal Close (`modalClose`):**
        *   **Oscillator:** `sine` (exponential frequency sweep downwards)
        *   **Frequency Ramp:** Sweep from `730Hz` to `430Hz`.
        *   **Envelope:** `gain: 0.08`, `attack: 0s`, `decay: 0.08s`, `release: 0.025s`.
    6.  **Success Chime (`success`):**
        *   **Oscillator:** `sine` (three-stage rising arpeggio)
        *   **Note 1:** `523Hz` (C5) | `gain: 0.12`, `attack: 0.003s`, `decay: 0.16s`, `release: 0.06s`.
        *   **Note 2:** `659Hz` (E5) | `gain: 0.10`, `attack: 0.003s`, `decay: 0.16s`, `release: 0.06s`, `delay: 0.07s` offset.
        *   **Note 3:** Swept from `784Hz` (G5) to `880Hz` (A5) | `gain: 0.10`, `attack: 0.003s`, `decay: 0.18s`, `release: 0.07s`, `delay: 0.14s` offset.
    7.  **Error Buzz (`error`):**
        *   **Filter:** `1200Hz` lowpass `BiquadFilter` to round off harsh edges.
        *   **Tone 1:** `sawtooth` wave | `320Hz` down to `140Hz` | `gain: 0.17`, `decay: 0.18s`, `release: 0.05s`.
        *   **Tone 2:** `square` wave | `180Hz` down to `90Hz` | `gain: 0.12`, `decay: 0.15s`, `release: 0.04s`, `delay: 0.03s` offset.

### B. Ambient Sound & Procedural Fallback Engine
The app streams ambient loops (Paris Cafe, Ocean Waves, Soft River) via `HTMLAudioElement`. If streaming fails due to offline state or network errors, it programmatically synthesizes filtered white noise:

1.  **Noise Buffer Generation:** Generates a 2-second audio buffer of pure random noise (`Math.random() * 2 - 1`).
2.  **Bandpass Filtering:** The noise buffer is connected to a `BiquadFilterNode` configured as a `bandpass` filter with custom parameters to shape the sound spectrum:
    *   **Beach Tone:** `filterHz: 2800Hz`, `Q: 0.7`, `gain: 0.085` (mimics high-frequency sea spray).
    *   **Paris Cafe Tone:** `filterHz: 1200Hz`, `Q: 1.1`, `gain: 0.06` (mimics vocal crowd hum).
    *   **River Tone (Default):** `filterHz: 700Hz`, `Q: 0.9`, `gain: 0.08` (mimics low-mid water rush).

---

## 2. Theme & Design Aesthetics

The visual system is designed to look premium, tactile, and warm, avoiding flat/generic shapes and pure blacks or primary colors.

### A. Color Palette (OKLCH Space)
Curtus uses the perceptually uniform OKLCH color space to define light and dark theme variables:

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.962 0.008 78)` | `oklch(0.21 0.022 265)` | L0 canvas background (warm clay / deep navy-slate) |
| `--card` | `oklch(0.997 0.0032 78)` | `oklch(0.238 0.018 268)` | L2 bright foreground card panels |
| `--foreground` | `oklch(0.205 0.0085 78)` | `oklch(0.962 0.006 78)` | Main readable body text |
| `--muted-foreground`| `oklch(0.485 0.012 75)` | `oklch(0.68 0.014 78)` | Low-contrast labels & metadata |
| `--cta` | `oklch(0.633 0.068 54)` | `oklch(0.652 0.072 54)` | Primary accent (restrained warm clay terracotta) |
| `--cta-foreground` | `oklch(0.986 0.014 82)` | `oklch(0.98 0.012 82)` | Text inside primary CTA elements |
| `--border` | `oklch(0.898 0.008 78)` | `oklch(0.35 0.02 268)` | Low-weight borders |

### B. Visual Texture and Layering
Three subtle textures are layered directly onto the DOM to create a paper-like, tactile feeling:

1.  **Paper Grain SVG:**
    An inline SVG fractal noise turbulency filter overlayed at very low opacity to eliminate digital sterile flat surfaces.
    *   *Light Mode Opacity:* `0.055`
    *   *Dark Mode Opacity:* `0.035`
    *   *SVG Data URI:*
        `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E")`
2.  **Angular Hatching Pattern (`--app-hatch`):**
    A repeating linear gradient tilted at `-48deg` overlayed on top of panel backgrounds:
    `repeating-linear-gradient(-48deg, rgb(22 25 37 / 0.02) 0px, rgb(22 25 37 / 0.02) 1px, transparent 1px, transparent 11px)`
3.  **Empty State Atmosphere (`.app-empty-atmosphere`):**
    Instead of using heavy graphics or illustrations for empty states, Curtus uses a composition of:
    *   A radial bloom colored with the clay CTA variable (`color-mix(in oklch, var(--cta) 10%, transparent)`) centered at `50% 48%`.
    *   The structural angular hatch `--app-hatch`.
    *   The paper grain noise image.

### C. Ceramic CTA Surfaces (`.app-cta-surface`)
Primary actions use a "soft ceramic" look rather than flat buttons:
*   **Background:** Mixed with white for gloss: `color-mix(in oklch, var(--cta) 90%, white 10%)`.
*   **Shadows:** Multi-layered, using organic warm clay tones instead of black:
    `0 1px 2px rgb(22 25 37 / 0.05), 0 8px 22px color-mix(in oklch, var(--cta) 11%, transparent), inset 0 1px 0 rgb(255 255 255 / 0.16)`.
*   **Hover State:** Lightened background (`white 14%`) and deeper shadow (`cta 13%`).
*   **Active State:** Darkened background (`black 8%`) and shallow shadow (`cta 8%`).

---

## 3. Typography & Typesetting System

Typography is engineered to feel sharp, technical, and clean, using the **Geist Font Family** paired with strict hierarchy rules.

### A. Font Selection
*   **Sans-Serif Font:** `Geist` (from `next/font/google` as `var(--font-geist-sans)`), set on the `body` tag with `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;`.
*   **Monospace Font:** `Geist Mono` (from `next/font/google` as `var(--font-geist-mono)`).
*   **Line Height:** Fixed globally on body to `1.52` for optimal line rhythm.

### B. Typesetting Rules & Letter Spacing
*   **Dynamic Headings:** `h1, h2, h3` have `text-wrap: balance` to prevent awkward word wraps.
*   **Body Texts:** Paragraphs `p` have `text-wrap: pretty` to eliminate orphans.
*   **Tabular Numbers:** Numbers inside statistics, timers, and leaderboard points are styled with `tabular-nums` (e.g., `font-variant-numeric: tabular-nums`) to avoid horizontal layout jitter during increments.
*   **Precision Font Classes:**
    *   *Micro Badges:* `text-[9.5px] font-medium` (used for room categories and avatar fallbacks).
    *   *Small Caps Labels:* `text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground` (requires `0.08em` letter-spacing to offset capitalization weight).
    *   *Sub-Labels:* `text-[10.5px] font-medium text-muted-foreground` or `text-[11px] font-medium`.
    *   *Primary Values:* `text-[22px] font-semibold tracking-tight text-foreground` (often paired with `tabular-nums` for timers).

---

## 4. Iconography & Assets

### A. UI Icons
UI icons are drawn exclusively from the **Lucide React** library (`lucide-react`). They are sized consistently using low-profile strokes (typically `size={16}` or `size={18}` with a stroke weight of `1.75` to `2` to match the thin border rules of the design system).

### B. Dynamic App Icon & Favicon Generator (`app/icon.tsx`)
The favicon is generated dynamically on the server rather than being loaded from a static image file. It uses Next.js `ImageResponse` (Vercel Satori engine) to draw a vector icon on-the-fly:

```typescript
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111827',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 700,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      CR
    </div>,
    size,
  );
}
```
*   **Output Details:** Produces a crisp 32x32 PNG containing the letters "CR" on a dark slate `#111827` background.
