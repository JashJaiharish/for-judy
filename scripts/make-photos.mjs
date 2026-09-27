/**
 * Generates ORIGINAL portrait placeholder photos so the gallery wall works
 * out of the box:   node scripts/make-photos.mjs
 * Replace /public/photos/karthu-0X.jpg with real portraits of Karthu.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const root = dirname(fileURLToPath(import.meta.url))
const outDir = join(root, '..', 'public', 'photos')
mkdirSync(outDir, { recursive: true })

/* ---- tiny PNG encoder (truecolor, no dependencies) ---- */
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
const crc32 = (buf) => {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
const encodePNG = (w, h, rgb) => {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8; ihdr[9] = 2
  const stride = w * 3
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

/* ---- cinematic placeholder: warm spotlight + portrait silhouette ---- */
function portrait({ w = 750, h = 1000, seed = 1 }) {
  const px = Buffer.alloc(w * h * 3)
  const rand = (n) => { const x = Math.sin(seed * 99.7 + n * 12.9898) * 43758.5453; return x - Math.floor(x) }
  const cx = 0.5 + Math.sin(seed * 3) * 0.05
  for (let y = 0; y < h; y++) {
    const v = y / h
    for (let x = 0; x < w; x++) {
      const u = x / w
      const dx = u - cx
      const glow = Math.max(0, 1 - Math.sqrt(dx * dx * 1.1 + (v - 0.36) ** 2 * 1.6) * 2.2)
      const beam = Math.max(0, Math.sin((u * 2.4 + v + seed) * 2.6)) ** 5 * 0.35
      // head + shoulders silhouette
      const headD = Math.sqrt((u - cx) ** 2 + ((v - 0.3) * 1.15) ** 2)
      const head = headD < 0.11 && v > 0.16 && v < 0.46
      const hat = v > 0.155 && v < 0.2 && Math.abs(u - cx) < 0.17
      const body = v > 0.46 && Math.abs(u - cx) < 0.24 * (1 - (v - 0.46) * 0.5) && v < 0.98
      const dark = head || hat || body
      let r = 5 + glow * 30 + beam * 90
      let g = 4 + glow * 26 + beam * 78
      let b = 3 + glow * 16 + beam * 30
      if (dark) { r *= 0.1; g *= 0.1; b *= 0.12 }
      const grain = (rand(y * w + x) - 0.5) * 12
      const i = (y * w + x) * 3
      px[i] = Math.max(0, Math.min(255, r + grain))
      px[i + 1] = Math.max(0, Math.min(255, g + grain))
      px[i + 2] = Math.max(0, Math.min(255, b + grain))
    }
  }
  return encodePNG(w, h, px)
}

for (let i = 1; i <= 6; i++) {
  const p = join(outDir, `karthu-0${i}.png`)
  writeFileSync(p, portrait({ seed: i * 7 + 3 }))
  console.log('wrote public/photos/karthu-0' + i + '.png')
}
console.log('\nDone — replace these with real portraits of Karthu (same names).')
