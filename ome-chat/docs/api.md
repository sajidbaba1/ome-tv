# Socket.IO Events

Client -> Server:
- `join` { userId? }
- `find-partner`
- `offer` { sdp }
- `answer` { sdp }
- `ice-candidate` { candidate }
- `skip`
- `leave`
- `chat` { text }

Server -> Client:
- `matched` { role: 'offer'|'answer', partnerId }
- `offer` { sdp, from }
- `answer` { sdp, from }
- `ice-candidate` { candidate, from }
- `partner-left`
- `chat` { text, from, ts }
