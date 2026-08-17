// Renders the link-preview cards in public/og/.
//
//   node scripts/og-cards.mjs
//
// These are the images WhatsApp and Facebook show when someone forwards a link,
// so they are built once and committed, not generated at request time. Run this
// again after editing a card below or changing the palette.
//
// A new campaign that wants its own card adds an entry to CARDS here and an
// `seo.image` line in its content file. test/content/ogCards.spec.ts fails if a
// campaign points at a card that was never rendered.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/og')

// Facebook, WhatsApp and X all read this size as the large card.
const WIDTH = 1200
const HEIGHT = 630

// The promise every card closes on, campaign or not. One line, so a parent
// scrolling a chat reads the same thing whichever link reached them.
const PAYOFF = 'Lebih perhatian untuk setiap pelajar, lebih yakin untuk berjaya.'

// Malay, because everyone who sees one of these cards is a parent.
const CARDS = [
  {
    file: 'default.png',
    eyebrow: 'Tuisyen online',
    headline: 'Kelas kecil, bimbingan lebih fokus',
    accent: 'bersama tutor berpengalaman.',
    pills: ['Tahun 1 hingga SPM', 'Maksimum 8 pelajar', '100% online'],
  },
  {
    file: 'ma-matematik-august.png',
    eyebrow: 'Ambilan Ogos 2026 · Tingkatan 4 dan 5',
    headline: 'Kelas Matematik SPM online,',
    accent: 'kumpulan kecil.',
    pills: ['RM180 sebulan', 'Maksimum 8 pelajar', 'Kelas percubaan percuma'],
  },
  {
    file: 'rendah-matematik-august.png',
    eyebrow: 'Ambilan Ogos 2026 · Tahun 4, 5 dan 6',
    headline: 'Matematik sekolah rendah,',
    accent: 'asas yang kukuh.',
    pills: ['RM120 sebulan', 'Maksimum 8 pelajar', 'Kelas percubaan percuma'],
  },
]

// Palette and radii are the ones in CLAUDE.md, copied rather than imported: this
// script runs outside the Nuxt build, where the CSS theme tokens do not exist.
const TINTS = [
  { bg: '#F1ECFF', fg: '#6B4BD6' },
  { bg: '#FFE6F0', fg: '#C2185B' },
  { bg: '#EAF3FF', fg: '#1B6FB8' },
]

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function html(card) {
  const pills = card.pills
    .map((label, i) => {
      const tint = TINTS[i % TINTS.length]
      return `<span class="pill" style="background:${tint.bg};color:${tint.fg}">${escape(label)}</span>`
    })
    .join('')

  return `<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    /* brand-deep to brand, with a pink bloom bottom-right */
    background:
      radial-gradient(900px 620px at 108% 118%, rgba(255,122,168,.55), transparent 62%),
      linear-gradient(132deg, #6B4BD6 0%, #8B6CF0 58%, #A78BF5 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .card {
    width: ${WIDTH - 88}px; height: ${HEIGHT - 88}px;
    background: #FFFFFF; border-radius: 30px;
    box-shadow: 0 24px 60px rgba(30,35,72,.22);
    padding: 52px 58px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .brand { display: flex; align-items: center; gap: 16px; }
  .mark {
    width: 66px; height: 66px; border-radius: 19px;
    background: linear-gradient(140deg, #8B6CF0, #6B4BD6);
    color: #fff; font-family: Fredoka, sans-serif; font-weight: 600; font-size: 31px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 18px rgba(107,75,214,.34);
  }
  .name { font-family: Fredoka, sans-serif; font-weight: 600; font-size: 31px; color: #1E2348; }
  .eyebrow {
    font-size: 20px; font-weight: 600; color: #8B6CF0;
    letter-spacing: .012em; margin-top: 4px;
  }
  h1 {
    font-family: Fredoka, sans-serif; font-weight: 600; font-size: 54px;
    line-height: 1.13; color: #1E2348; letter-spacing: -.014em;
    margin: 24px 0 0;
  }
  /* Block, so the accent clause starts its own line exactly as LandingHero
     sets it. Left to wrap it strands a word like "kukuh." on a line alone. */
  h1 .accent { color: #6B4BD6; display: block; }
  .payoff {
    font-size: 25px; font-weight: 500; color: #5B6080;
    line-height: 1.4; margin-top: 16px;
  }
  .pills { display: flex; gap: 12px; }
  .pill {
    border-radius: 999px; padding: 13px 24px;
    font-size: 21px; font-weight: 600; white-space: nowrap;
  }
  .foot {
    display: flex; align-items: flex-end; justify-content: space-between;
    border-top: 1px solid #ECEAF4; padding-top: 22px;
  }
  .domain { font-size: 21px; font-weight: 600; color: #5B6080; }
  .motto { font-size: 19px; color: #8388A5; }
</style>
</head>
<body>
  <div class="card">
    <div>
      <div class="brand">
        <div class="mark">Hz</div>
        <div>
          <div class="name">Hz Academy</div>
          <div class="eyebrow">${escape(card.eyebrow)}</div>
        </div>
      </div>
      <h1>${escape(card.headline)} <span class="accent">${escape(card.accent)}</span></h1>
      <div class="payoff">${escape(PAYOFF)}</div>
    </div>
    <div class="pills">${pills}</div>
    <div class="foot">
      <div class="domain">demo.hzacademy.my</div>
      <div class="motto">Dipercayai sejak 2014</div>
    </div>
  </div>
</body>
</html>`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
await mkdir(OUT, { recursive: true })

for (const card of CARDS) {
  await page.setContent(html(card), { waitUntil: 'networkidle' })
  // Without this the first render can land on the fallback system font.
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png' })
  await writeFile(resolve(OUT, card.file), png)
  console.log(`${card.file}  ${(png.length / 1024).toFixed(0)} KB`)
}

await browser.close()
