# Local To Do
Uses local storage to keep track of to do items built using Svelte.

## Installation
```bash
git clone https://github.com/dayvidwhy/local-to-do.git
cd local-to-do
npm install
npm run dev
```

## How it works
Persistance is achieved by stringifying our to do items and storing them in local storage, a browser API that holds onto the items between page visits.

## Deployment
Deployment scripts are provided to push the built directory to the `gh-pages` branch which can then be served up using GitHub pges.

```bash
npm run build
npm run deploy
```