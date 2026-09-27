/* ============================================================================
   KARTHU — A GOLDEN NIGHT · PERSONAL CONTENT FILE
   ⭐ THIS IS THE ONLY FILE YOU NEED TO EDIT ⭐

   Photos: drop portrait images into  /public/photos/  and update the paths
   below. Portrait orientation (taller than wide) looks best on the gallery
   wall — around 750×1000px is perfect. JPG, PNG or WebP all work.

   Everything on the page — names, captions, the letter, the final message —
   is read from this file. You never need to touch the React components.
   ========================================================================== */

export const karthu = {
  name: 'Karthu',

  /* ---------- music & video ---------- */
  music: '/music/song.mp3', // Drop your audio/MP3 file into /public/music/song.mp3
  loadingVideo: '/video/loading.mp4', // Drop your loading video file into /public/video/loading.mp4

  /* ---------- intro ---------- */
  introLead: 'Tonight, the spotlight is for...', // shown first, softly
  introWord: 'Karthu', // the calligraphy word drawn by the golden pen
  introHeroLine: 'Happy Birthday ❤', // shown under her name

  /* ---------- hero ---------- */
  heroMessage: 'Tonight is all about you.',
  heroLines: ['Among all the lights,', 'you will always be the one', 'I look for.'],

  /* ---------- hanging photo wall ---------- */
  photos: [
    { image: '/photos/karthu-01.jpg', caption: 'My favorite smile.' },
    { image: '/photos/karthu-02.jpg', caption: 'One of my favorite memories.' },
    { image: '/photos/karthu-03.jpg', caption: 'You, being you.' },
    { image: '/photos/karthu-04.jpg', caption: 'That golden afternoon.' },
    { image: '/photos/karthu-05.jpg', caption: 'Home is wherever this is.' },
    { image: '/photos/karthu-06.jpg', caption: 'My favorite view.' },
  ],
  galleryLetterImage: '/photos/gallery-letter.png', // Drop photo into /public/photos/gallery-letter.jpg to show between gallery and letter

  /* ---------- the letter ---------- */
  letter: `I don't know how many birthdays
we'll get to celebrate together,

but I know that every one I get
to celebrate with you

will always mean something to me.`,

  letterSignature: 'Happy Birthday, my favorite person. ❤',

  /* ---------- star & reason section ---------- */
  starLabel: 'THE STAR',
  reasonLabel: 'AND THE REASON FOR THE SHOW',
  starImage: '/photos/star-reason.jpg', // Separate photo for this section (drop your custom image at /public/photos/star-reason.jpg)

  /* ---------- cake ---------- */
  cakePrompt: 'Make a wish, Karthu.',
  cakeAfterAll: 'Now make your wish.',
  wishButton: 'MAKE A WISH',
  wishDone: 'I hope your wish comes true.',

  /* ---------- finale ---------- */
  finaleGif: '/photos/my-dance.gif', // Drop your GIF into /public/photos/ and set the path here (e.g. '/photos/dance.gif')
  finalMessages: ['Karthu', 'Happy Birthday ❤', 'Keep shining.'],
  finalWhisper: "I'll always be somewhere in the crowd, cheering for you.",
  finalLove: 'I love you.',

  /* ---------- hidden easter eggs (keep them subtle) ---------- */
  gloveMessage: 'Found it. ❤',
  starMessage: "You're my favorite person.",
}

/* The silhouette used on this site is an ORIGINAL hand-drawn SVG inspired by
   classic stage performers (fedora, suit, white glove) — it is not a photo or
   likeness of any real person, and there is no copyrighted artwork anywhere. */
