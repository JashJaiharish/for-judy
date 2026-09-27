# For Karthu — A Golden Night 🌙

A single-page, cinematic black-and-gold birthday experience.
One long scroll: a golden pen writes her name, a spotlight finds a silhouette,
her photographs hang like memories, a letter surfaces, candles are lit,
and the night ends with a whisper.

Built with React + Vite + GSAP (ScrollTrigger) + Lenis + a touch of Framer-era polish.
No 3D, no dashboard, no navbar — just typography, photography, light and timing.

---

## 1 · Run it

```bash
npm install
npm run dev
```

Open the printed URL. Production build:

```bash
npm run build
npm run preview
```

---

## 2 · Make it hers — **edit one file only**

Everything personal lives in **`src/data/karthu.js`**:

| What | Where |
|---|---|
| Her name / intro word | `name`, `introWord` |
| Hero lines | `heroMessage`, `heroLines` |
| **Photos + captions** | `photos` — drop images into `/public/photos/` |
| **The letter** | `letter` (line breaks preserved) + `letterSignature` |
| Star & reason labels | `starLabel`, `reasonLabel` |
| Cake texts | `cakePrompt`, `cakeAfterAll`, `wishDone` |
| Final words | `finalMessages`, `finalWhisper`, `finalLove` |
| Easter-egg messages | `gloveMessage`, `starMessage` |

**Photos:** portrait orientation (≈750×1000px) looks best. Save them as
`/public/photos/karthu-01.jpg` … `karthu-06.jpg` and update the paths in
`photos`. The placeholders currently there are generated art — swap freely.

---

## 3 · The journey (what she'll see)

1. **Intro** — blackness → a tiny golden light → *"Tonight, the spotlight is
   for…"* → **"Karthu"** is written by a glowing golden pen (SVG flourish +
   masked reveal) with a sweeping underline → *Happy Birthday ❤* →
   a soft spotlight sweeps the stage → the page breathes open.
   (Tap anywhere to enter early; `?fast` plays a short cut.)
2. **Hero** — the fedora silhouette in rim-lit shadow on the left, her name
   in gold script on the right.
3. **The Gallery** — six portraits hanging from strings, swaying gently.
   Hover: the spotlight leans in. Click: full-screen with its caption.
4. **The Letter** — pinned while the lines surface one by one in the light.
5. **The Star & The Reason** — performer and portrait, one golden line between.
6. **The Cake** — tap all five candles → *"Now make your wish."* →
   the button → flames flicker out → *"I hope your wish comes true."*
7. **Finale** — the silhouette glides, fades; *"Karthu… Happy Birthday… Keep
   shining"* → the whisper → everything fades to one golden star →
   *"I love you."*

**Easter eggs:** a small white glove hides past the gallery; a tiny gold star
rests near the cake. Each gives one quiet message when found.

---

## 4 · Design system

- Colors: `#000/#050505` night · `#D4AF37` gold · `#F5D76E` bright gold ·
  `#F8F5ED` cream · `#5A0F14` wine (reserved accents)
- Type: **Great Vibes** (the golden script), **Cormorant Garamond** (body),
  **Jost** (small-caps labels)
- Motion: slow GSAP timelines, ScrollTrigger scrubbing, Lenis smooth scroll,
  film grain + vignette overlays, `prefers-reduced-motion` respected
- The silhouette is an original hand-drawn SVG inspired by classic stage
  performers — no photos or likenesses of real people, no copyrighted art.

## 5 · Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Or import the repo at vercel.com (framework: **Vite**). Output is `dist/`,
`base: './'` is already set — Netlify/GitHub Pages work identically.

---

Made for one person, on purpose. ❤
