# Frontend Deployment Skill

This skill documents how to deploy the Nuxt frontend to cloud hosting providers like Render.

## Deployment Target Options

### Option A: Automated Deploy via GitHub Actions & Render (Recommended)
We have configured a deploy workflow in `.github/workflows/deploy.yml` that triggers on pushes to the `main` branch.

#### Setup Repository Secrets on GitHub:
1. Go to your frontend repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following secret:
   - `RENDER_DEPLOY_HOOK_URL`: The Deploy Hook URL provided by Render in your Web Service dashboard settings (looks like `https://api.render.com/deploy/srv-...`).

---

### Option B: Direct Deploy to Render (Auto Deploy)
Render has native, built-in CD support.

1. Go to your **Render Dashboard** and click on your Frontend Web Service.
2. Go to the **Settings** tab.
3. Scroll down to the **Auto Deploy** setting and ensure it is set to **Yes**.
4. Set the **Branch** to `main`.
5. Verify build settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `node .output/server/index.mjs` (for Nuxt node server output)
   - Expose Port: Nuxt default or custom port.
