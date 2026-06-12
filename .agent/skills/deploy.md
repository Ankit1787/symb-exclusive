# Frontend Deployment Skill

This skill documents how to deploy the Nuxt frontend to cloud hosting providers like Vercel and Netlify using GitHub Actions or direct integrations.

## Deployment Target Options

### Option A: Automated Deploy via GitHub Actions (Recommended)
We have configured a deploy workflow in `.github/workflows/deploy.yml`. When changes are pushed or merged to the `main` branch, the workflow automatically builds and deploys the app to Vercel.

#### Setup Repository Secrets on GitHub:
1. Go to your frontend repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel Personal Access Token (generate at Vercel Settings -> Tokens).
   - `VERCEL_ORG_ID`: Your Vercel Organization ID (found in `~/.vercel/project.json` or team settings).
   - `VERCEL_PROJECT_ID`: Your Vercel Project ID (found in `~/.vercel/project.json` or project settings).

---

### Option B: Deploy to Vercel (Direct Integration)
Vercel has native integration for Nuxt projects.

1. **GitHub Integration**: Link your GitHub repository in the Vercel Dashboard.
2. **Configure Root Directory**: Vercel automatically detects Nuxt and sets:
   - Build Command: `npm run build`
   - Output Directory: `.output`
3. **Environment Variables**: Add key:
   - `NUXT_PUBLIC_API_URL` = your production server backend URL (e.g., `https://exclusive-api.onrender.com/api`).

---

### Option C: Deploy to Netlify
Netlify supports Nuxt out of the box.

1. **GitHub Integration**: Add a site from your GitHub repository in Netlify.
2. **Configure Base Directory**: Set Base directory to `frontend`.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `frontend/.output/public`
4. **Environment Variables**: Set:
   - `NUXT_PUBLIC_API_URL` = your production backend API.
