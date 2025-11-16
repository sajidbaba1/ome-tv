const STUN_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }]

export function createPeer(socket) {
  const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS })

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit('ice-candidate', { candidate: e.candidate })
    }
  }

  pc.onconnectionstatechange = () => {
    // Optional: handle states for UI/metrics
    // console.log('PC state', pc.connectionState)
  }

  return pc
}

export function attachLocalStream(stream, videoRef) {
  if (videoRef.current) {
    videoRef.current.srcObject = stream
  }
}

export function handleRemoteTrack(event, videoRef) {
  const [stream] = event.streams
  if (videoRef.current) {
    videoRef.current.srcObject = stream
  }
}

export async function makeOffer(pc, socket) {
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  socket.emit('offer', { sdp: offer })
}

export async function handleOffer(pc, sdp, socket) {
  await pc.setRemoteDescription(new RTCSessionDescription(sdp))
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  socket.emit('answer', { sdp: answer })
}

export async function handleAnswer(pc, sdp) {
  await pc.setRemoteDescription(new RTCSessionDescription(sdp))
}

export async function addIceCandidate(pc, candidate) {
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
  } catch (e) {
    console.error('Error adding ICE candidate', e)
  }
}

export function closePeer(pc) {
  try {
    // Do not stop tracks here; preserve camera/mic across skips
    pc.getSenders()?.forEach(s => {
      try { pc.removeTrack(s) } catch {}
    })
    pc.onicecandidate = null
    pc.ontrack = null
    pc.close()
  } catch {}
}

export function stopStream(stream) {
  try {
    stream?.getTracks()?.forEach(t => t.stop())
  } catch {}
}

export function isStreamActive(stream) {
  if (!stream) return false
  const tracks = [...(stream.getAudioTracks?.() || []), ...(stream.getVideoTracks?.() || [])]
  if (tracks.length === 0) return false
  return tracks.some(t => t.readyState === 'live')
}
