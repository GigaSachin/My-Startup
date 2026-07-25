

# Vercel pe `themilkkart.in` deploy karne ka full plan

## Asli problem (kyun 404 aa raha hai)

Aapka project **TanStack Start (SSR)** hai. Vercel ne build to kar liya, but galat config ki wajah se output ko **plain static site** samajh raha hai — isliye root pe koi `index.html` nahi milta aur `404: NOT_FOUND` aata hai.

3 cheezein missing/galat hain:

1. `package.json` me **`start`** script nahi hai (TanStack Start ko Vercel pe Node server chahiye).
2. `vite.config.ts` me **Cloudflare target** set hai (default Lovable config). Vercel ke liye `target: "vercel"` chahiye taaki `.vercel/output/` me proper Vercel Build Output bane.
3. Vercel project settings me **Framework Preset** "Other" pe hoga — usse `Vite` ya proper Output Directory pe set karna padega (ya humare config se auto-detect karwana).

## Plan (Lovable default mode me jaa ke karne wale changes)

### Step A — `vite.config.ts` ko Vercel target dena

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { target: "vercel" },
});
```

Ye change Lovable preview / Cloudflare publish ko break nahi karega, but Vercel build ke time `.vercel/output/` folder generate karega jo Vercel directly samajhta hai (zero-config).

### Step B — `package.json` me scripts update

```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "start": "node .output/server/index.mjs",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

### Step C — `DEPLOY-README.md` me Vercel-specific section

GoDaddy DNS records aur Vercel dashboard steps add karna (neeche user-facing guide me likha hai).

## Aapko Vercel & GoDaddy pe ye karna hai (manual steps)

Lovable changes ho jaane ke baad GitHub me auto-push hoga. Phir:

### 1) Vercel Dashboard pe
1. `gigasachins-projects` → apna project (`milkkart-launchpad-fr2r`) kholo
2. **Settings → General**:
   - Framework Preset: **Vite** (ya "Other" rehne do — humara config khud handle karega)
   - Build Command: `npm run build` (default)
   - Output Directory: **khaali chhod do** (auto-detect)
   - Install Command: `npm install`
3. **Deployments → Redeploy** (latest commit pe) → "Use existing Build Cache" UNCHECK karke deploy
4. Build success hone ke baad `https://milkkart-launchpad-fr2r.vercel.app` kholo — site dikhni chahiye ✅

### 2) Vercel pe custom domain add karna
1. Same project → **Settings → Domains**
2. `themilkkart.in` type karke **Add**
3. `www.themilkkart.in` bhi add karo (recommended)
4. Vercel 2 records dikhayega — copy kar lo:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`

### 3) GoDaddy pe DNS set karna
1. GoDaddy → **My Products** → `themilkkart.in` → **DNS** → **Manage Zones**
2. Purane parking/forwarding A records **delete** kar do
3. Add karo:
   - Type: **A**, Name: **@**, Value: **76.76.21.21**, TTL: 600
   - Type: **CNAME**, Name: **www**, Value: **cname.vercel-dns.com**, TTL: 600
4. **Save**
5. 5–30 min wait karo. Vercel Domains page pe green tick aate hi `https://themilkkart.in` live ho jayega (SSL auto) ✅

## Technical notes

- TanStack Start `target: "vercel"` Vercel Build Output API v3 emit karta hai (`.vercel/output/config.json` + `functions/` + `static/`). Vercel zero-config isi se SSR Node function aur static assets dono serve karta hai — yahi 404 ka root cause fix hai.
- SPA fallback / `index.html` ki tension nahi — SSR Node function har request pe HTML render karega.
- Cloudflare wala `wrangler.jsonc` chhod sakte ho — Vercel use nahi karega, koi conflict nahi.
- `start` script local production preview ke liye hai; Vercel khud serverless function chalata hai, isliye Vercel pe iski zaroorat nahi.

## Confirm karke "Approve plan" dabao — phir main:
1. `vite.config.ts` me Vercel target add karunga
2. `package.json` me `start` script add karunga
3. `DEPLOY-README.md` me upar wale GoDaddy + Vercel steps likh dunga

Uske baad aap Vercel pe **Redeploy** dabaoge aur GoDaddy DNS daal doge — `themilkkart.in` 30 min me live.

