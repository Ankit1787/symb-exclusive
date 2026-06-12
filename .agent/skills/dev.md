# Frontend Development Skill

This skill explains how to run the Nuxt 4 application in the development environment.

## Prerequisites
- Node.js installed on the host.
- Backend server running (if integration testing is needed).
- A `.env` file in the `frontend/` directory pointing to the backend API.

### Environment Setup (`.env`)
Make sure the following variables are configured in `frontend/.env`:
```env
# Nuxt environment variables
NUXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Running the Dev Server
To start the Nuxt dev server with hot-reloading:

1. Open a terminal and navigate to the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```powershell
   npm install
   ```
3. Run the development command:
   ```powershell
   npm run dev
   ```

## Verification
- Look for console output:
  - `Nuxt DevTools` enabled message (optional).
  - `Local: http://localhost:3000/`
- Open your browser to `http://localhost:3000` to verify that the home page renders correctly.
