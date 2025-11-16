# Ome Chat

A free, production-ready OmeTV/Omegle-like random video chat app built with React (Vite), TailwindCSS, MUI, WebRTC, and a Node.js + Express + Socket.IO signaling server.

- Frontend: Vite + React + TailwindCSS + MUI
- Backend: Node.js + Express + Socket.IO
- Signaling: WebSockets
- STUN: stun:stun.l.google.com:19302 (no TURN to keep it 100% free)
- Hosting (free): Vercel (frontend), Render (backend)

## Monorepo Structure

```
ome-chat/
  frontend/
  backend/
  docs/
```

## Quick Start (Local)

- Requirements: Node 18+

### Backend
```
cd backend
npm install
npm run dev
```
Server runs at http://localhost:8080

### Frontend
```
cd frontend
npm install
npm run dev
```
Front-end runs at http://localhost:5173

Create `frontend/.env` with:
```
VITE_BACKEND_URL=http://localhost:8080
```

## Deployment
- Frontend → Vercel (set `VITE_BACKEND_URL` to your Render URL)
- Backend → Render (Node Web Service, enable WebSocket, set CORS ORIGIN to your Vercel domain)

See `docs/deployment.md` for step-by-step instructions.
