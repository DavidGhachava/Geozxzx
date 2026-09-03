# GEO — Georgian language learning

Responsive marketing site and web-app frontend for GEO. The current build uses local mock data and exports as a static site.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable static site is generated in `dist/client`.

## Deploy with Netlify

1. Import this GitHub repository in Netlify using **Add new site → Import an existing project**.
2. Select the repository and leave the detected settings from `netlify.toml` unchanged.
3. Netlify will run `npm run build` and publish `dist/client` with Node.js 22.
4. Deploy the site, then connect the final domain under **Domain management**.

## Prepare Supabase

The application is not connected to a backend yet. When a Supabase project is ready:

1. Copy `.env.example` to `.env.local` for local development.
2. In Supabase, copy the **Project URL** and **Publishable key** from the project's API settings.
3. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
4. In Netlify, add the same names under **Project configuration → Environment variables** and redeploy.
5. Add the production Netlify URL and local callback URL to Supabase Authentication URL configuration before enabling login.
6. Keep secret/service-role keys server-side only. Never place them in a `NEXT_PUBLIC_` variable or commit them.

The pinned Supabase packages are installed and the browser client is available from `lib/supabase/client.ts`.

This site currently deploys as a static export. Do not add Next.js server clients, route handlers, or request middleware unless the deployment is intentionally changed to an SSR runtime. Backend implementation should add migrations, generated database types, Row Level Security policies and verification tests. Every exposed table must have an intentional access policy.
