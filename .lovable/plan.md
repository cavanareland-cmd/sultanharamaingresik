# Deploy to Vercel — Migration Plan

The project currently builds for Cloudflare Workers (via `@lovable.dev/vite-tanstack-config` → nitro Cloudflare preset) and uses a custom `src/server.ts` SSR entry. We'll retarget the build to Vercel and adjust the server entry / env handling so everything works on Vercel's runtime.

## What changes

### 1. Build target → Vercel
Update `vite.config.ts` to override nitro's preset to `vercel` (or `vercel-edge`). We'll use the **Node Vercel preset** (`vercel`) for maximum compatibility — Supabase admin client, `crypto`, etc., all work without Worker constraints.

```ts
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  vite: {
    // passthrough — nitro preset override
  },
  nitro: { preset: "vercel" },
});
```

(If `@lovable.dev/vite-tanstack-config` doesn't expose `nitro`, fall back to setting `NITRO_PRESET=vercel` env var at build time via `vercel.json`.)

### 2. SSR entry compatibility
`src/server.ts` exports a Cloudflare-style `{ fetch }` handler. Nitro's Vercel preset wraps the TanStack Start handler automatically, so we'll keep `src/server.ts` but ensure it still exports a request handler nitro can adapt. No logic changes — only verify the export shape works for the Vercel preset (the `fetch(request, env, ctx)` signature is compatible since nitro normalizes it).

### 3. `vercel.json`
Add a minimal `vercel.json` at the project root:

```json
{
  "framework": null,
  "buildCommand": "bun run build",
  "outputDirectory": ".output",
  "installCommand": "bun install"
}
```

Nitro's Vercel preset emits the correct `.vercel/output` structure automatically when preset is `vercel`, so we may not even need `vercel.json` — but including it pins the install/build commands to bun.

### 4. Environment variables on Vercel
The user must add these in **Vercel Project Settings → Environment Variables** (we can't set them from here):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `LOVABLE_API_KEY` (if AI features used)

Values are in the current `.env` and Lovable Cloud secrets panel. The `VITE_*` ones are needed at build time; the rest at runtime.

### 5. Supabase Auth redirect URLs
After first Vercel deploy, add the Vercel URL(s) to Supabase Auth allowed redirect URLs so admin login at `/auth` works on the Vercel domain.

### 6. Documentation
Add a short `DEPLOY_VERCEL.md` with: connect repo → set env vars → deploy → add redirect URL.

## What stays the same
- All routes, server functions, Supabase integration code
- Database (still Lovable Cloud / Supabase)
- Admin CMS at `/admin`

## Out of scope
- Moving the database off Lovable Cloud (not needed — Vercel app will keep talking to the same Supabase backend)
- Custom domain setup on Vercel (user does that in Vercel dashboard)

## Confirm before I proceed
1. **Runtime**: Node (`vercel` preset, recommended) vs Edge (`vercel-edge`, lighter but more constraints)? I recommend **Node**.
2. You'll handle adding env vars in the Vercel dashboard after I push the config changes — correct?
