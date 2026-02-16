# Deployment notes (Vercel)

So the site keeps working on **www.germanfinancialplanning.com** and **www.germanfinancialplanning.de**.

## What fixed the 404 (don’t undo)

- **Next.js 15** – We’re on 15.x. Next 16 caused 404 on Vercel (build succeeded, runtime 404). Stay on 15 until you’re ready to test 16 again.
- **vercel.json** – In the repo root with `"framework": "nextjs"` and `"buildCommand": "next build"`. Keeps Vercel using the right build/output.
- **Layouts** – New layout files must use `import type { ReactNode } from 'react'` and the type `ReactNode` (not `React.ReactNode`), or the production build fails ESLint.

## Safe to change

- **Look and feel** – CSS, Tailwind, components, copy, images. No impact on the 404 fix.
- **New pages** – Add routes under `src/app/` as usual. In any new `layout.tsx`, use the `ReactNode` import above.
- **Dependencies** – Updating **patch/minor** versions (e.g. `npm update`) is fine. Before upgrading **Next.js** or **React** to a new major, run `npm run build` and test the Vercel deployment.

## Before upgrading Next.js to 16

1. Try the upgrade in a branch.
2. Run `npm run build` locally.
3. Deploy to Vercel (e.g. preview) and open the deployment URL. If you see 404 again, stay on 15 until the Next/Vercel issue is resolved.
