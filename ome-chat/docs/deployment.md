# Deployment (Free tiers)

## Backend (Render)
1. Create a new Web Service
2. Connect Git repo or deploy from folder
3. Build command: none (Node)
4. Start command: `node index.js`
5. Environment
   - `PORT` (Render provides)
   - `CORS_ORIGIN` = `https://your-vercel-domain.vercel.app`
6. Enable WebSockets
7. Deploy and note the base URL, e.g. `https://ome-chat-backend.onrender.com`

## Frontend (Vercel)
1. Import project from repo or deploy the `frontend/` folder
2. Environment variable:
   - `VITE_BACKEND_URL` = your Render URL (e.g. above)
3. Build Command: `npm run build`
4. Output Dir: `dist`
5. Deploy

## Local testing
- Backend: `npm run dev` in `backend/` (port 8080)
- Frontend: `npm run dev` in `frontend/` and `.env` with `VITE_BACKEND_URL=http://localhost:8080`
