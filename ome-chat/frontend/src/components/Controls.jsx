import { Stack, Button } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import CallEndIcon from '@mui/icons-material/CallEnd'

export default function Controls({ muted, cameraOn, onToggleMic, onToggleCam, onSkip, onEnd }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button variant="outlined" startIcon={muted ? <MicOffIcon/> : <MicIcon/>} onClick={onToggleMic}>
        {muted ? 'Unmute' : 'Mute'}
      </Button>
      <Button variant="outlined" startIcon={cameraOn ? <VideocamIcon/> : <VideocamOffIcon/>} onClick={onToggleCam}>
        {cameraOn ? 'Camera Off' : 'Camera On'}
      </Button>
      <Button variant="contained" color="info" startIcon={<SkipNextIcon/>} onClick={onSkip}>
        Next
      </Button>
      <Button variant="contained" color="error" startIcon={<CallEndIcon/>} onClick={onEnd}>
        End
      </Button>
    </Stack>
  )
}
