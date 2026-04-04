# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"The Many Names of Dan" is a comedic browser game (15-30 min) with 7 levels, each revealing a dramatic title for Dan Lambourne (an HR rep) followed by a themed mini-game. Built as a static site with vanilla JS + Canvas + small libraries. The full game design is in `the_many_names_of_dan_design.md` and tech stack research is in `doc/work-sessions/2026/2026-04-02_22-54-28-research-game-tech-stack.md`.

## Commands

```
npm run dev      # Start Vite dev server with hot reload
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

No test framework, linter, or formatter is configured.

## Architecture

**Entry point:** `index.html` loads `src/main.js`, which orchestrates the entire game as a linear async sequence: title screen -> intro crawl -> (name reveal -> level -> victory scroll -> transition) x7 -> ending -> credits.

**Game state** (`src/state.js`): Simple `{ currentLevel, levelResults[] }` object persisted to localStorage. Each level receives state, runs gameplay (returns a Promise), and resolves with results.

**Level modules** (`src/levels/level{1-7}-*.js`): Each exports a `run(container, state)` async function. Levels 1, 2, 6, 7 are DOM-based (clicks, drag, buttons). Levels 3, 5 use Canvas with the game loop. Level 4 (wheel) uses GSAP-animated CSS/Canvas.

**Scene modules** (`src/scenes/`): Reusable cinematic sequences (name-reveal, narrator typewriter, victory-scroll, intro-crawl, credits, ending, transition). Each exports `run(container, ...)`.

**Engine** (`src/engine/`): `game-loop.js` provides a `createGameLoop(onTick)` with start/stop and delta-time. `particles.js` is a hand-rolled Canvas particle system.

**Graphics** (`src/graphics/`): Programmatic SVG/Canvas drawing functions for Dan, the boss, and shared geometric shapes. No external image assets.

**Data** (`src/data/`): Static content — emails, sins, wheel rounds, maze layout, disputes, narrator text. All game text/content lives here, separate from logic.

**Styling** (`src/styles/`): CSS organized by concern — `main.css` (global + level color palettes as CSS custom properties on `.level-N` classes), `crawl.css`, `reveal.css`, `narrator.css`, `levels.css`.

## Key Dependencies

| Library          | Purpose                             |
|------------------|-------------------------------------|
| GSAP             | Animation sequencing, wheel spin    |
| Howler.js        | Audio playback, sprite support      |
| canvas-confetti  | Finale confetti burst               |
| Splitting.js     | Per-character text animation        |
| Vite             | Dev server and build tooling        |

## Design Decisions

- Plain JavaScript, no TypeScript, no framework
- Desktop browsers only
- All art is programmatic (SVG/Canvas) — no image assets, no emoji characters
- DOM for UI-heavy levels; Canvas + game loop for action levels
- CSS keyframes for looping/ambient animations; GSAP for scripted one-shot sequences
- Narrator text uses typewriter effect with skip button (shows full text) + separate continue button (advances)
- Failure should be nearly impossible; on failure, narrator roasts the player and allows instant retry
- Tone is deadly-serious epic fantasy narration applied to mundane HR situations
- Fonts: Cinzel Decorative (boss names), Cinzel (narration), MedievalSharp (title), Crimson Text (body)
