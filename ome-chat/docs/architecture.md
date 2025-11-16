# Architecture

- Frontend: Vite + React + Tailwind + MUI
  - Pages: `Home` and `Chat`
  - Components: `VideoPlayer`, `Controls`
  - Utils: `signaling.js` (Socket.IO client), `webrtc.js` (RTCPeerConnection helpers)
  - Env: `VITE_BACKEND_URL` for signaling server

- Backend: Node.js + Express + Socket.IO
  - `index.js` bootstraps Express, CORS, Helmet, and Socket.IO server
  - `matchmaking.js` manages in-memory queue and pairs
  - `signaling.js` wires socket events: `join`, `find-partner`, `offer`, `answer`, `ice-candidate`, `skip`, `disconnect`

- STUN:
  - Google STUN `stun:stun.l.google.com:19302`
  - No TURN to keep infra 100% free

- State:
  - In-memory only; cleared on server restart
