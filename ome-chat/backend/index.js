import { createApp, createHttpServer } from './server.js'

const PORT = process.env.PORT || 8080

const app = createApp()
const { httpServer } = createHttpServer(app)

httpServer.listen(PORT, () => {
  console.log(`Signaling server running on :${PORT}`)
})
