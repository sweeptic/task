# Senior Frontend (React) — Mini UI Ownership Challenge

Timebox: 30–45 minutes  
Tools: GitHub Copilot (and other GenAI)  
Stack: React 18 (function components + hooks), Vite, plain JavaScript

## Scenario
You’re shipping a tiny Issue Dashboard with search, an “Open only” filter, and priority sorting.

## Setup
1) `npm install`  
2) `npm run dev`  
3) Open the printed localhost URL.

## Tasks
A) Fix a subtle sorting issue so that list ordering is predictable across interactions.  
B) Add a “Priority” filter (All/Low/Medium/High) that composes with the existing filters.

## Acceptance
- No in-place mutation of props/state when deriving UI (immutability respected).
- Priority filter works with search and “Open only.”
- Uses stable React patterns (function components, basic hooks).
- Reasonable a11y (use labels/aria).

## Submit
Commit your changes with a brief note:
- What you changed for sorting and why.
- How you added the priority filter.