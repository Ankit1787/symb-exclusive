# Frontend Deployment Skill

This skill documents how to deploy the Nuxt frontend to cloud hosting providers like Vercel and Netlify.

## Deployment Target Options

### Option A: Deploy to Vercel (Recommended)
Vercel has native integration for Nuxt projects.

1. **GitHub Integration**: Link your GitHub repository in the Vercel Dashboard.
2. **Configure Root Directory**: In settings, set the root directory to `frontend/` (since this is a multi-repo umbrella project).
3. **Build Settings**: Vercel automatically detects Nuxt and sets:
   - Build Command: `npm run build`
   - Output Directory: `.output`
4. **Environment Variables**: Add key:
   - `NUXT_PUBLIC_API_URL` = your production server backend URL (e.g., `https://exclusive-api.onrender.com/api`).

### Option B: Deploy to Netlify
Netlify supports Nuxt out of the box.

1. **GitHub Integration**: Add a site from your GitHub repository in Netlify.
2. **Configure Base Directory**: Set Base directory to `frontend`.
3. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `frontend/.output/public`
4. **Environment Variables**: Set:
   - `NUXT_PUBLIC_API_URL` = your production backend API.
5. **Configuration**: If using Netlify redirects, ensure you configure a `_redirects` file in `public/` directory for Vue Router SPA fallback.
