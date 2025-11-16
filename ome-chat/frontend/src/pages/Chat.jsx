import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Container, Box, Stack, Chip, Typography, Grid } from '@mui/material'
import VideoPlayer from '../components/VideoPlayer'
import Controls from '../components/Controls'
import ChatPanel from '../components/ChatPanel'
import { createSocket, registerCoreHandlers, sendChat } from '../utils/signaling'
import { createPeer, attachLocalStream, handleRemoteTrack, makeOffer, handleOffer, handleAnswer, addIceCandidate, closePeer, isStreamActive } from '../utils/webrtc'

export default function Chat() {
  const [status, setStatus] = useState('Idle')
  const [muted, setMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pcRef = useRef(null)
  const socketRef = useRef(null)
  const userIdRef = useRef(uuidv4())
  const localStreamRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
    const socket = createSocket(backendUrl)
    socketRef.current = socket

    registerCoreHandlers(socket, {
      onMatched: async ({ role, partnerId }) => {
        setStatus('Partner found')
        if (!pcRef.current) pcRef.current = createPeer(socket)

        if (role === 'offer') {
          await makeOffer(pcRef.current, socket)
        }
      },
      onOffer: async ({ sdp, from }) => {
        if (!pcRef.current) pcRef.current = createPeer(socket)
        await handleOffer(pcRef.current, sdp, socket)
      },
      onAnswer: async ({ sdp }) => {
        await handleAnswer(pcRef.current, sdp)
      },
      onIce: async ({ candidate }) => {
        await addIceCandidate(pcRef.current, candidate)
      },
      onPartnerLeft: () => {
        setStatus('Partner left, searching…')
        if (pcRef.current) closePeer(pcRef.current)
        pcRef.current = createPeer(socket)
        socket.emit('find-partner')
      },
      onChat: ({ text, from, ts }) => {
        setMessages(prev => [...prev, { sender: 'Stranger', text, ts: ts || Date.now() }])
      },
    })

    async function init() {
      setStatus('Requesting media…')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      attachLocalStream(stream, localVideoRef)
      setStatus('Searching…')

      if (!pcRef.current) pcRef.current = createPeer(socket)
      stream.getTracks().forEach(t => pcRef.current.addTrack(t, stream))
      pcRef.current.ontrack = e => handleRemoteTrack(e, remoteVideoRef)

      socket.emit('join', { userId: userIdRef.current })
      socket.emit('find-partner')
    }

    init().catch(err => {
      console.error(err)
      setStatus('Permission denied or device error')
    })

    return () => {
      try { socket.emit('leave') } catch {}
      try { socket.disconnect() } catch {}
      if (pcRef.current) { closePeer(pcRef.current); pcRef.current = null }
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  const onSkip = async () => {
    setStatus('Skipping…')
    if (pcRef.current) closePeer(pcRef.current)
    pcRef.current = createPeer(socketRef.current)
    // Ensure we have an active local stream (reacquire if ended)
    if (!isStreamActive(localStreamRef.current)) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        attachLocalStream(stream, localVideoRef)
      } catch (e) {
        console.error('Failed to reacquire media on Next', e)
        setStatus('Cannot access camera/mic')
        return
      }
    }
    // add tracks
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => pcRef.current.addTrack(t, localStreamRef.current))
    pcRef.current.ontrack = e => handleRemoteTrack(e, remoteVideoRef)
    socketRef.current.emit('skip')
  }

  const onEnd = () => {
    socketRef.current.emit('leave')
    if (pcRef.current) { closePeer(pcRef.current); pcRef.current = null }
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop())
    setStatus('Ended')
  }

  const onToggleMic = () => {
    if (!localStreamRef.current) return
    const enabled = localStreamRef.current.getAudioTracks().some(t => t.enabled)
    localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !enabled)
    setMuted(!muted)
  }

  const onToggleCam = () => {
    if (!localStreamRef.current) return
    const enabled = localStreamRef.current.getVideoTracks().some(t => t.enabled)
    localStreamRef.current.getVideoTracks().forEach(t => t.enabled = !enabled)
    setCameraOn(!cameraOn)
  }

  const onSendChat = () => {
    const text = chatInput.trim()
    if (!text) return
    sendChat(socketRef.current, text)
    setMessages(prev => [...prev, { sender: 'You', text, ts: Date.now() }])
    setChatInput('')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Ome Chat</Typography>
        <Chip label={status} color="info" variant="outlined" />
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VideoPlayer refEl={localVideoRef} title="You" muted />
            <VideoPlayer refEl={remoteVideoRef} title="Stranger" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Controls
              muted={muted}
              cameraOn={cameraOn}
              onToggleMic={onToggleMic}
              onToggleCam={onToggleCam}
              onSkip={onSkip}
              onEnd={onEnd}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChatPanel
            messages={messages}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={onSendChat}
          />
        </Grid>
      </Grid>
    </Container>
  )
}
