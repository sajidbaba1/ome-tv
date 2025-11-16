import { randomUUID } from 'crypto'
import { createMatchmaking } from './matchmaking.js'

export default function initSignaling(io) {
  const mm = createMatchmaking()
  const skipCooldownMs = 1200
  const meta = new Map() // socket.id -> { userId, lastSkip }

  io.on('connection', (socket) => {
    meta.set(socket.id, { userId: randomUUID(), lastSkip: 0 })

    socket.on('join', ({ userId } = {}) => {
      // Optional custom client id
      if (userId) meta.set(socket.id, { ...(meta.get(socket.id) || {}), userId })
    })

    socket.on('find-partner', () => {
      const { matched, partnerId } = mm.findPartnerFor(socket.id)
      if (matched) {
        // Randomly choose offerer
        const offerer = Math.random() < 0.5 ? socket.id : partnerId
        const answerer = offerer === socket.id ? partnerId : socket.id
        io.to(offerer).emit('matched', { role: 'offer', partnerId: answerer })
        io.to(answerer).emit('matched', { role: 'answer', partnerId: offerer })
      }
    })

    socket.on('offer', ({ sdp } = {}) => {
      const partner = mm.getPartner(socket.id)
      if (!partner || !sdp || sdp.type !== 'offer') return
      io.to(partner).emit('offer', { sdp, from: socket.id })
    })

    socket.on('answer', ({ sdp } = {}) => {
      const partner = mm.getPartner(socket.id)
      if (!partner || !sdp || sdp.type !== 'answer') return
      io.to(partner).emit('answer', { sdp, from: socket.id })
    })

    socket.on('ice-candidate', ({ candidate } = {}) => {
      const partner = mm.getPartner(socket.id)
      if (!partner || !candidate) return
      io.to(partner).emit('ice-candidate', { candidate, from: socket.id })
    })

    socket.on('chat', ({ text } = {}) => {
      if (typeof text !== 'string' || text.length === 0 || text.length > 1000) return
      const partner = mm.getPartner(socket.id)
      if (!partner) return
      io.to(partner).emit('chat', { text, from: socket.id, ts: Date.now() })
    })

    socket.on('skip', () => {
      const m = meta.get(socket.id) || { lastSkip: 0 }
      const now = Date.now()
      if (now - m.lastSkip < skipCooldownMs) return
      m.lastSkip = now
      meta.set(socket.id, m)

      const partner = mm.unpair(socket.id)
      if (partner) io.to(partner).emit('partner-left')
      // re-enqueue both
      const { matched } = mm.findPartnerFor(socket.id)
      if (!matched) return
      // We'll wait for partner to find someone; pairing happens when second user arrives
    })

    function cleanup() {
      const partner = mm.unpair(socket.id)
      if (partner) io.to(partner).emit('partner-left')
      mm.removeFromQueue(socket.id)
      meta.delete(socket.id)
    }

    socket.on('leave', cleanup)
    socket.on('disconnect', cleanup)
  })
}
