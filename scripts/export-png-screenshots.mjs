import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE = process.env.BASE_URL || 'http://localhost:5174'
const OUT = path.resolve('figma-export', 'png')
const WIDTH = 390

const pages = [
  { file: 'apply.png', route: '/apply' },
  { file: 'article.png', route: '/article/1' },
  { file: 'blogs.png', route: '/blogs' },
  { file: 'about.png', route: '/about' },
  { file: 'placements.png', route: '/placements' },
  { file: 'course-detail.png', route: '/course-detail' },
  { file: 'home.png', route: '/' },
]

fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })

for (const { file, route } of pages) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: 844 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  const url = `${BASE}${route}`
  console.log(`Screenshot ${file} <- ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(OUT, file),
    fullPage: true,
    type: 'png',
  })
  const stat = fs.statSync(path.join(OUT, file))
  console.log(`  -> ${file} (${(stat.size / 1024).toFixed(0)} KB)`)
  await context.close()
}

await browser.close()
console.log(`Done: ${OUT}`)