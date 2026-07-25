# Milkkart — Deploy Guide

Ye TanStack Start (SSR) app hai. Static hosting (GoDaddy cPanel) pe nahi chalega — JS runtime chahiye.

---

## ✅ Vercel pe deploy karna (Recommended for `themilkkart.in`)

Project ab Vercel ke liye configured hai (`vite.config.ts` me `target: "vercel"`).

### Step 1 — Vercel Dashboard

1. Vercel → apna project (`milkkart-launchpad-fr2r`) kholo
2. **Settings → General**:
   - Framework Preset: **Other** (humara config khud handle karega)
   - Build Command: `npm run build`
   - Output Directory: **khaali chhodo** (auto-detect `.vercel/output`)
   - Install Command: `npm install`
3. **Deployments → latest commit → Redeploy** ("Use existing Build Cache" UNCHECK)
4. Build success → `https://milkkart-launchpad-fr2r.vercel.app` kholke check karo ✅

### Step 2 — Custom domain Vercel pe add karo

1. Project → **Settings → Domains**
2. `themilkkart.in` add karo
3. `www.themilkkart.in` bhi add karo
4. Vercel ye records dikhayega:
   - **A**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`

### Step 3 — GoDaddy pe DNS set karo

1. GoDaddy → **My Products** → `themilkkart.in` → **DNS** → **Manage Zones**
2. Purane parking/forwarding A records **delete** karo
3. Add karo:
   | Type  | Name | Value                  | TTL |
   |-------|------|------------------------|-----|
   | A     | @    | 76.76.21.21            | 600 |
   | CNAME | www  | cname.vercel-dns.com   | 600 |
4. **Save**
5. 5–30 min wait. Vercel Domains page pe green tick → `https://themilkkart.in` live (SSL auto) ✅

---

## Other options

### Cloudflare Workers
`wrangler.jsonc` already configured. Note: Vercel target ke saath build karoge to `.vercel/output` banega; Cloudflare ke liye config wapas `defineConfig()` (without target) karna padega.

```bash
npm install && npm run build && npx wrangler deploy
```

### Lovable Publish (sabse easy)
Lovable editor me **Publish** button — sab handle ho jata hai, custom domain bhi.

---

## Local dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
```
