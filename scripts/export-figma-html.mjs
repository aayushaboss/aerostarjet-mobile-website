import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE = process.env.BASE_URL || 'http://localhost:5174'
const OUT = path.resolve('figma-export')
const VIEWPORT = { width: 390, height: 844 }

const pages = [
  { file: 'apply.html', route: '/apply', title: 'Apply' },
  { file: 'article.html', route: '/article/1', title: 'Article' },
  { file: 'blogs.html', route: '/blogs', title: 'Blogs' },
  { file: 'about.html', route: '/about', title: 'About' },
  { file: 'placements.html', route: '/placements', title: 'Placements' },
  { file: 'course-detail.html', route: '/course-detail', title: 'Course Detail' },
  { file: 'home.html', route: '/', title: 'Home' },
]

async function collectCss(page) {
  return page.evaluate(() => {
    const chunks = []
    for (const sheet of document.styleSheets) {
      try {
        const rules = [...sheet.cssRules].map((r) => r.cssText).join('\n')
        if (rules) chunks.push(rules)
      } catch {
        // skip cross-origin
      }
    }
    return chunks.join('\n')
  })
}

async function getRootHtml(page) {
  return page.evaluate(() => {
    const root = document.getElementById('root')
    return root ? root.innerHTML : ''
  })
}

function rewriteAssets(html) {
  return html
    .replaceAll('/assets/', 'assets/')
    .replaceAll('src="assets/', 'src="assets/')
}

function buildDocument({ title, css, bodyHtml }) {
  const content = rewriteAssets(bodyHtml)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=390, initial-scale=1.0" />
  <title>${title} - Aerostar Aviation Academy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fffffb; }
    body { font-family: Poppins, ui-sans-serif, system-ui, sans-serif; }
    .figma-frame { width: 390px; margin: 0 auto; overflow: hidden; background: #fffffb; }
    ${css}
  </style>
</head>
<body>
  <div class="figma-frame">
    ${content}
  </div>
</body>
</html>`
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: VIEWPORT })
const page = await context.newPage()

for (const { file, route, title } of pages) {
  const url = `${BASE}${route}`
  console.log(`Exporting ${file} from ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(2000)
  const [css, bodyHtml] = await Promise.all([collectCss(page), getRootHtml(page)])
  const html = buildDocument({ title, css, bodyHtml })
  fs.writeFileSync(path.join(OUT, file), html, 'utf8')
  console.log(`  -> ${file} (${(html.length / 1024).toFixed(1)} KB)`)
}

await browser.close()
console.log(`Done. Files in ${OUT}`)