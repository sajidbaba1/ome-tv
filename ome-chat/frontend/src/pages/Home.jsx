import { useNavigate } from 'react-router-dom'
import { Button, Container, Typography, Box } from '@mui/material'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box textAlign="center">
        <Typography variant="h2" gutterBottom>Ome Chat</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Random video chat with strangers using WebRTC + Socket.IO
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/chat')}>
          Start
        </Button>
      </Box>
    </Container>
  )
}
