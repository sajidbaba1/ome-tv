import { io } from 'socket.io-client'

export function createSocket(baseUrl) {
  const socket = io(baseUrl, {
    transports: ['websocket'],
    autoConnect: true,
  })
  return socket
}

export function registerCoreHandlers(socket, handlers) {
  const {
    onMatched = () => {},
    onOffer = () => {},
    onAnswer = () => {},
    onIce = () => {},
    onPartnerLeft = () => {},
    onChat = () => {},
    onOnlineCount = () => {},
  } = handlers

  socket.on('matched', onMatched)
  socket.on('offer', onOffer)
  socket.on('answer', onAnswer)
  socket.on('ice-candidate', onIce)
  socket.on('partner-left', onPartnerLeft)
  socket.on('chat', onChat)
  socket.on('online-count', onOnlineCount)
}

export function sendChat(socket, text) {
  if (!text || typeof text !== 'string') return
  socket.emit('chat', { text })
}
