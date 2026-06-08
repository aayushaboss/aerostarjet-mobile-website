import { chromium } from 'playwright'

const BASE = 'http://localhost:5174'
const VIEWPORT = { width: 390, height: 844 }

const captures = [
  { name: 'Home', path: '/', captureId: '1048f8f1-ae24-4280-9af4-3864f766a1a8' },
  { name: 'Course Detail', path: '/course-detail', captureId: '66eeb999-9e0b-484d-af05-bff72446fd4b' },
  { name: 'Placements', path: '/placements', captureId: 'dd8b24e5-1896-4cf5-ac5e-0a9a5c74e09d' },
  { name: 'About', path: '/about', captureId: '114093ad-dd59-4252-b55e-c98cc87e0fdc' },
  { name: 'Apply', path: '/apply', captureId: '7c8a9a5d-0227-4bd7-b421-d61fb295849a' },
  { name: 'Blogs', path: '/blogs', captureId: '28b67c5f-5470-4daf-9614-f2b2c04e0c66' },
  { name: 'Article', path: '/article/1', captureId: 'e7797ed5-638a-4ae8-a8d8-e426f5c13e0b' },
]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: VIEWPORT })
const page = await context.newPage()

for (const { name, path, captureId } of captures) {
  const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit`
  const hash = `#figmacapture=${captureId}&figmaendpoint=${encodeURIComponent(endpoint)}&figmadelay=3000`
  const url = `${BASE}${path}${hash}`
  console.log(`Opening ${name}: ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(8000)
  console.log(`Done waiting for ${name}`)
}

await browser.close()
console.log('All capture URLs visited.')