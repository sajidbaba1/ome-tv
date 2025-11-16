import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Server } from 'socket.io'
import initSignaling from './signaling.js'

export function createApp() {
  const app = express()
  const ORIGIN = process.env.CORS_ORIGIN || '*'
  app.use(helmet())
  app.use(cors({ origin: ORIGIN, credentials: true }))
  app.get('/', (req, res) => res.json({ ok: true, name: 'Ome Chat signaling' }))
  return app
}

export function createHttpServer(app) {
  const httpServer = createServer(app)
  const ORIGIN = process.env.CORS_ORIGIN || '*'
  const io = new Server(httpServer, { cors: { origin: ORIGIN, methods: ['GET', 'POST'] } })
  initSignaling(io)
  return { httpServer, io }
}
