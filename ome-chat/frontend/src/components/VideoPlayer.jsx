import { Card, CardContent, Typography } from '@mui/material'

export default function VideoPlayer({ refEl, title, muted = false }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
        <video ref={refEl} autoPlay playsInline muted={muted} className="w-full rounded-md bg-black aspect-video" />
      </CardContent>
    </Card>
  )
}
