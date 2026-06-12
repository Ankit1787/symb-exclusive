# Frontend Build & Compilation Skill

This skill explains how to build the Nuxt application for production.

## Commands

### 1. Nuxt Prepare (TypeScript definitions generation)
To prepare TypeScript typings for Nuxt files (auto-imports, schemas, etc.):
1. Navigate to the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Run prepare:
   ```powershell
   npm run postinstall
   ```

### 2. Production Build (SSR mode)
To build the server-side rendered application:
1. Navigate to the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Run build:
   ```powershell
   npm run build
   ```
This will output the compiled server/client bundles to `.output/`.

### 3. Static Site Generation (SSG mode)
To pre-render all pages of the application to static HTML:
1. Navigate to the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Run generate:
   ```powershell
   npm run generate
   ```
This will output static files into the `dist/` directory.

### 4. Local Preview of Production Build
To check the built bundle locally:
1. Run local preview:
   ```powershell
   npm run preview
   ```
This starts the production server locally at `http://localhost:3000`.
