# Abhinav Krishna P — Portfolio

Static single-page portfolio, grouped around Shopify apps, agentic AI, n8n Copilot, desktop tools and workflow / QA automation.

## Run locally

From this folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

No build step or external hosting is required.

## Edit

- Page content: `index.html` (header and hero include same-page section navigation; hero also carries Mail, LinkedIn, GitHub and LeetCode icon links)
- Visual system and responsive layout: `styles.css`
- Small interaction helpers: `script.js`
- Projects: each card in `#work` is a `.project-item`; its `<template>` holds the modal content. Categories are the `.work-nav` tabs (vertical on desktop, a scrollable row on mobile) — update the count in each tab's `<em>` when adding a project
- LeetCode / GitHub cards load live data in `script.js` (GitHub REST API, github-contributions-api.jogruber.de, a public LeetCode stats proxy). Numbers in `index.html` are fallbacks shown if those requests fail; responses are cached in localStorage for 30 minutes
- Resume and project images: `assets/` (resume links point at `assets/Abhinav_Krishna_P_26_10_2026.pdf`; update both links in `index.html` when replacing it)
