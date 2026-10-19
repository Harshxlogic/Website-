# Harsh Vardhan Anand — Portfolio

A React + TypeScript + Vite portfolio with scroll-driven project/skill sections and an interactive marble bust.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Recent refinements

- Replaced the bust artwork with a cleaner, higher-resolution 1087 × 1446 transparent asset.
- Increased particle detail while balancing animation cost.
- Made cursor tracking relative to the bust bounds rather than the whole viewport, so it no longer tilts toward unrelated cursor positions.
- Reduced rotation range and improved spring damping for more controlled movement.
- Fixed particle hit-testing to use the canvas bounding rectangle, avoiding offset errors when the canvas is responsively scaled or transformed.
- Softened the cursor-following light for a more natural marble highlight.
- Cursor movement resets smoothly when leaving the bust; reduced-motion preferences remain supported.
