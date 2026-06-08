import { chromium } from 'playwright'

const captureId = 'ac5c39d2-3436-4af3-8aca-bd3c7235f698'
const endpoint = encodeURIComponent(`https://mcp.figma.com/mcp/capture/${captureId}/submit`)
const url = `http://localhost:5174/apply#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=3000&figmaselector=%23root`

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
console.log('Opening', url)
await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(12000)
console.log('Done waiting for auto-capture')
await browser.close()