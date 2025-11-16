import { useEffect, useRef } from 'react'
import { Card, CardContent, Typography, Box, TextField, IconButton, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function ChatPanel({ messages, input, onInputChange, onSend }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Chat</Typography>
        <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', borderRadius: 1, p: 1, bgcolor: 'rgba(255,255,255,0.03)' }}>
          {messages.map((m, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">{m.sender} · {new Date(m.ts).toLocaleTimeString()}</Typography>
              <Typography variant="body2">{m.text}</Typography>
            </Box>
          ))}
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message…"
            fullWidth
            size="small"
          />
          <IconButton color="primary" onClick={onSend} aria-label="send">
            <SendIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
