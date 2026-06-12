# Deploy to Vercel

This project is configured to deploy to **Vercel** using the nitro `vercel`
preset (Node serverless). The Cloudflare Workers entry (`src/server.ts`) is
still used as the SSR entry — nitro wraps it for the Vercel runtime.

## 1. Push the repo to GitHub / GitLab / Bitbucket

Vercel deploys from a Git repository. Push this project to a repo first.

## 2. Import the project in Vercel

1. Go to <https://vercel.com/new>
2. Import your Git repository
3. **Framework Preset**: leave as **Other** (we set `framework: null` in
   `vercel.json`). The `buildCommand` and `installCommand` are already pinned.
4. **Root Directory**: keep as the repo root
5. Do NOT click Deploy yet — add env vars first (next step)

## 3. Add Environment Variables

In **Project Settings → Environment Variables**, add the following for
**Production, Preview, and Development**:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | From the project's `.env` |
| `SUPABASE_PUBLISHABLE_KEY` | From the project's `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | Lovable Cloud → Backend → Secrets (copy the value) |
| `VITE_SUPABASE_URL` | Same value as `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same value as `SUPABASE_PUBLISHABLE_KEY` |
| `VITE_SUPABASE_PROJECT_ID` | From the project's `.env` |
| `LOVABLE_API_KEY` | Only needed if you use Lovable AI features |

> `VITE_*` variables are baked in at build time. `SUPABASE_*` (without the
> `VITE_` prefix) are read at runtime inside server functions.

## 4. Deploy

Click **Deploy**. Vercel will run `bun install` then `bun run build`, which
produces a `.vercel/output/` directory that Vercel picks up automatically.

## 5. Configure Supabase Auth redirect URLs

After the first deploy, copy your Vercel production URL (e.g.
`https://your-app.vercel.app`) and add it to the Supabase Auth allow-list so
admin login at `/auth` works on the Vercel domain:

1. Open the **Backend** panel in Lovable
2. Go to **Auth → URL Configuration**
3. Add `https://your-app.vercel.app` (and any preview deploy URLs you want
   to test) to **Redirect URLs** and **Site URL**

## 6. (Optional) Custom domain

Add a custom domain in **Vercel Project Settings → Domains**, then add the
domain to the Supabase Auth allow-list the same way.

## Notes

- The database (Lovable Cloud / Supabase) keeps running where it is. Vercel
  only hosts the frontend + server functions.
- Lovable's own `*.lovable.app` URL keeps working independently. You can
  publish to both.
- If a build fails on Vercel with a Node-version error, set **Node.js
  Version** to **20.x** in Project Settings → General.