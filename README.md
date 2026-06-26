# uncaged

> Play freely. Break out of the box.

Inspired by Guthrie Trapp, Uncaged transforms the CAGED system from static boxes into a living, playable map of the fretboard, so you can move between chord shapes, scales, arpeggios, and licks with confidence, and finally understand how everything connects.

---

<img width="1919" height="957" alt="image" src="https://github.com/user-attachments/assets/175de3ef-44dc-4622-86a0-3d6184ea6ec3" />

--- 


## Features

**Fretboard Visualization**
- Full 24-fret interactive fretboard
- Toggle note names, intervals, or triads as overlays
- View all 5 CAGED positions simultaneously or focus on one
- Left-handed mode with full fretboard flip

**CAGED System**
- All 5 chord shapes (C, A, G, E, D) across every key
- Chord tone highlighting within scale positions
- Play any chord shape with a single click

**Scales**
- Major Scale, Major Pentatonic, and Arpeggio
- All 12 keys
- Click any note on the fretboard to hear it

**Audio Playback**
- Play scales ascending, descending, or both directions
- Adjustable BPM (40–240)
- Acoustic guitar sound powered by [smplr](https://github.com/danigb/smplr) — no setup, no downloads

**Tunings**
- Standard (EADGBe)
- Drop D, Open G, Open D, Open E
- DADGAD, Half Step Down, Full Step Down

---

## Stack

- **React 19** + **TypeScript**
- **Vite**
- **Zustand** for state management
- **Tonal.js** for music theory primitives
- **smplr** for Web Audio playback
- **SCSS**

---

## Built with Claude

Uncaged was developed alongside **Claude** (Anthropic), used as a real engineering collaborator, not just for boilerplate, but for audio API decisions, feature design, and shipping faster without cutting corners.

In 2026, the best software is built by pairing human taste and domain knowledge with AI execution. This project is a working example of that.

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## License

MIT
