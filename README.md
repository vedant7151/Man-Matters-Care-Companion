# Man Matters Care Companion

A consumer-facing concept prototype for managing personal-care routines, recording personal check-ins and planning product replenishment.

## Important research context

The five customer feedback records supplied for Part 1 were positive and did not establish a recurring customer problem. This app is therefore a **hypothesis-led prototype**, not a solution to a pain point proven by those interviews. Validate the need for routine management, progress journaling and reorder planning with additional customers before presenting it as a validated solution.

## Features

- Add and remove products in a personal routine.
- Choose category, frequency and usual time.
- Mark daily routine steps complete.
- View daily completion and a consistency streak.
- Add personal journal check-ins and notes.
- Add estimated reorder dates and see upcoming dates.
- Persist app data in the browser's `localStorage`.
- No customer names, phone numbers or interview data are included.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build for deployment

```bash
npm run build
npm run preview
```

The production-ready static site is generated in `dist/`.

## Deploy

### Vercel
1. Create a new Git repository and upload the contents of this project.
2. Import the repository into Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

### Netlify
1. Import the repository.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

## Data and privacy notes

- Routine and journal data are stored in the current browser on the current device using `localStorage`.
- There is no backend, account system, cloud sync or cross-device backup.
- Clearing browser storage or using another browser/device will not preserve the data.
- Do not enter sensitive health information. This is a personal organization prototype, not a medical tool.
- The app does not send push notifications. Reorder dates are shown in the app when it is opened.
- Product instructions and professional advice should take precedence over any personal checklist.

## Reset

Use **Reset demo data** in the left sidebar to clear the app's locally stored data and restore the starter example.
