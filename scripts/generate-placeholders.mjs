/**
 * Generates ORIGINAL placeholder assets so the show runs out of the box:
 * cinematic-looking PNG stills, SVG art, and synthesized WAV audio.
 *   node scripts/generate-placeholders.mjs
 * Replace anything in public/ with your real photos, voice and music later.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const root = dirname(fileURLToPath(import.meta.url))
const pub = (p) => join(root, '..', 'public', p)
const ensure = (p) => mkdirSync(dirname(p), { recursive: true })

/* ---------------------------------- PNG ---------------------------------- */
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function encodePNG(width, height, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  const stride = width * 3
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = deflateSync(raw, { level: 6 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

/* ------------------------------ photo render ------------------------------ */
function makePhoto({ w, h, seed, lines = 'gold' }) {
  const px = Buffer.alloc(w * h * 3)
  const palette = { gold: [230, 181, 74], red: [142, 31, 47], chrome: [217, 222, 230] }
  const accent = palette[lines] || palette.gold
  const rand = (n) => { const x = Math.sin(seed * 99.7 + n * 12.9898) * 43758.5453; return x - Math.floor(x) }
  for (let y = 0; y < h; y++) {
    const v = y / h
    for (let x = 0; x < w; x++) {
      const u = x / w
      const dx = u - 0.5
      const dy = (v - 0.42) * 1.15
      const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2.1)
      const beam = Math.max(0, Math.sin((u * 3.2 + v * 1.4 + seed) * 3.0)) ** 6
      const cx = 0.5 + Math.sin(seed + v * 2.2) * 0.06
      const silh = v > 0.35 && Math.abs(u - cx) < 0.11 * (1 - (v - 0.35) * 0.4)
      let r = 6 + glow * 30 + beam * accent[0] * 0.5
      let g = 6 + glow * 26 + beam * accent[1] * 0.5
      let b = 8 + glow * 24 + beam * accent[2] * 0.5
      if (silh) { r *= 0.14; g *= 0.14; b *= 0.18 }
      const grain = (rand(y * w + x) - 0.5) * 16
      const i = (y * w + x) * 3
      px[i] = Math.max(0, Math.min(255, r + grain))
      px[i + 1] = Math.max(0, Math.min(255, g + grain))
      px[i + 2] = Math.max(0, Math.min(255, b + grain))
    }
  }
  return encodePNG(w, h, px)
}

/* ---------------------------------- WAV ---------------------------------- */
const TAU = Math.PI * 2
function wav({ seconds, notes, style = 'pad', seed = 1 }) {
  const rate = 22050
  const n = Math.floor(rate * seconds)
  const data = Buffer.alloc(n * 2)
  const rand = (i) => { const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453; return x - Math.floor(x) }
  const bpm = 84
  const beat = 60 / bpm
  for (let i = 0; i < n; i++) {
    const t = i / rate
    const beatPos = t / beat
    const idx = Math.floor(beatPos)
    const freq = notes[idx % notes.length]
    const inBeat = beatPos - idx
    const env = style === 'arp'
      ? Math.max(0, 1 - inBeat * 1.4)
      : 0.62 + 0.38 * Math.sin(TAU * beatPos * 0.25)
    let s = 0
    if (style === 'arp') {
      s += Math.sin(TAU * freq * t) * 0.5
      s += Math.sin(TAU * freq * 2 * t) * 0.18
    } else if (style === 'chords') {
      s += Math.sin(TAU * freq * t) * 0.4
      s += Math.sin(TAU * freq * 1.5 * t) * 0.22
      s += Math.sin(TAU * freq * 2 * t) * 0.12
    } else {
      s += Math.sin(TAU * freq * t) * 0.4
      s += Math.sin(TAU * freq * 0.5 * t) * 0.2
    }
    s += (rand(i) - 0.5) * 0.06
    // gentle fade in/out
    const fade = Math.min(1, t / 1.2, (seconds - t) / 1.6)
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s * env * 0.22 * 32767 * Math.max(0, fade)))), i * 2)
  }
  const buf = Buffer.alloc(44)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + data.length, 4); buf.write('WAVE', 8)
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22)
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(1, 32); buf.writeUInt16LE(16, 34)
  buf.write('data', 36); buf.writeUInt32LE(data.length, 40)
  return Buffer.concat([buf, data])
}

/* --------------------------------- write --------------------------------- */
const photos = [
  ['photos/the-beginning.jpg', 1600, 1000, 3, 'gold'],
  ['photos/first-laugh.jpg', 1600, 1000, 7, 'red'],
  ['photos/that-crazy-day.jpg', 1600, 1000, 11, 'gold'],
  ['photos/the-moment-i-knew.jpg', 1600, 1000, 17, 'chrome'],
  ['photos/our-little-adventures.jpg', 1600, 1000, 23, 'gold'],
  ['photos/late-night.jpg', 1600, 1000, 29, 'red'],
  ['photos/our-song.jpg', 1600, 1000, 37, 'gold'],
  ['photos/favorite-photo.jpg', 1600, 1000, 41, 'chrome'],
  ['photos/most-emotional.jpg', 1600, 1000, 43, 'red'],
  ['photos/star.jpg', 1400, 900, 47, 'gold'],
]
for (const [name, w, h, seed, lines] of photos) {
  const p = pub(name)
  ensure(p)
  writeFileSync(p, makePhoto({ w, h, seed, lines }))
  console.log('wrote', name)
}

const tracks = [
  ['audio/track-1.wav', 'Our First Song', 44, [220, 262, 294, 349], 'pad'],
  ['audio/track-2.wav', 'A Song That Reminds Me Of You', 40, [196, 247, 294, 392], 'chords'],
  ['audio/track-3.wav', 'Your Birthday Track', 36, [262, 330, 392, 523], 'arp'],
  ['audio/track-4.wav', 'One Last Surprise', 32, [175, 220, 262, 330], 'chords'],
  ['audio/ambient-stage.wav', 'Ambient Stage Hum', 24, [98, 110], 'pad'],
]
for (const [name, , seconds, notes, style] of tracks) {
  const p = pub(name)
  ensure(p)
  writeFileSync(p, wav({ seconds, notes, style, seed: name.length }))
  console.log('wrote', name)
}

writeFileSync(pub('favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><radialGradient id="g" cx="50%" cy="42%"><stop offset="0%" stop-color="#fff8e0"/><stop offset="55%" stop-color="#E6B54A"/><stop offset="100%" stop-color="rgba(230,181,74,0)"/></radialGradient></defs>
  <circle cx="32" cy="30" r="30" fill="url(#g)"/>
  <circle cx="32" cy="30" r="7" fill="#fffdf4"/>
</svg>`)
writeFileSync(pub('glove.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <g fill="#f7f3e8" stroke="#d8b04a" stroke-width="1.4">
    <path d="M22 8c-3 6-4 14-2 20 1 4 1 8-1 12-2 5 1 10 7 10 8 0 18-3 20-11 2-8-2-13-5-20-2-5-4-11-8-13-4-2-9 0-11 2z"/>
    <path d="M22 50c2 3 5 5 9 5" fill="none"/>
  </g></svg>`)
writeFileSync(pub('memory-frame.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
  <rect x="4" y="4" width="292" height="212" fill="rgba(0,0,0,0.72)" stroke="#E6B54A" stroke-width="3"/>
  <rect x="16" y="16" width="268" height="164" fill="#101014"/>
  <rect x="16" y="188" width="268" height="2" fill="#8a6d2b"/>
  <circle cx="150" cy="98" r="34" fill="none" stroke="#8a6d2b" stroke-width="1.5"/>
  <path d="M132 112 168 84" stroke="#E6B54A" stroke-width="2"/></svg>`)
console.log('wrote svg placeholders')
console.log('\nDone — all placeholders are original generated art/synth audio.')
