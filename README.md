# Capston Supabase PWA Starter

Opinionated starter that wires a Next.js App Router project with Supabase,
progressive-web-app support (`next-pwa`), and a Vercel-friendly build setup.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a `.env.local`** file at the project root with the Supabase keys:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The PWA shell runs at [http://localhost:3000](http://localhost:3000). Supabase
   health is reported on the landing page so you can verify the keys immediately.

4. **Lint (optional but recommended)**

   ```bash
   npm run lint
   ```

## Supabase Integration

- The helper at `src/lib/supabaseClient.ts` throws when the required env vars are
  missing, so your build will fail fast without secrets.
- The landing page attempts to `select` from a `pwa_projects` table so you can
  drop in a table with sample data and watch the UI update instantly.
- Deploying to Vercel requires setting the same env vars under
  `Project Settings → Environment Variables`.

## PWA & Offline Ready Shell

- `next-pwa` injects a service worker that caches `_next` assets and the manifest
  files so the shell loads even when offline.
- `public/manifest.webmanifest` and the generated icons under
  `public/icons/*` describe the installable app and brand colors.
- The layout metadata includes the manifest link, theme colors, and icons.

## Deployment

1. Connect the repository to [Vercel](https://vercel.com).
2. Add ``NEXT_PUBLIC_SUPABASE_URL`` and ``NEXT_PUBLIC_SUPABASE_ANON_KEY`` to the
   Vercel project settings (make sure they are environment-specific if needed).
3. Push to the `main` branch—Vercel will build, cache assets via
   `next-pwa`, and publish the PWA shell automatically.

## Testing & Previewing

- Development: `npm run dev`
- Production build: `npm run build && npm run start`
- Lint: `npm run lint`This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
