// In-memory matchmaking queue and pairs
// Clear on server restart

export function createMatchmaking() {
  const queue = [] // socket.id waiting
  const pairs = new Map() // socket.id -> partnerId

  function isPaired(id) {
    return pairs.has(id)
  }

  function removeFromQueue(id) {
    const idx = queue.indexOf(id)
    if (idx !== -1) queue.splice(idx, 1)
  }

  function pairSockets(a, b) {
    pairs.set(a, b)
    pairs.set(b, a)
  }

  function unpair(id) {
    const partner = pairs.get(id)
    if (partner) {
      pairs.delete(id)
      pairs.delete(partner)
      return partner
    }
    pairs.delete(id)
    return null
  }

  function findPartnerFor(id) {
    removeFromQueue(id)
    if (queue.length === 0) {
      queue.push(id)
      return { matched: false }
    }
    // FIFO: take first waiting user
    const partnerId = queue.shift()
    pairSockets(id, partnerId)
    return { matched: true, partnerId }
  }

  function getPartner(id) {
    return pairs.get(id) || null
  }

  return { queue, pairs, findPartnerFor, removeFromQueue, getPartner, unpair, isPaired }
}
