export async function run(target, browser) {
  console.log('🇮🇳 India Amazon adapter')

  const page = await browser.newPage()

  await page.goto(target.url, { waitUntil: 'domcontentloaded' })

  // Amazon India common selectors
  const selectors = [
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '.a-price .a-offscreen'
  ]

  let priceText = null

  for (const sel of selectors) {
    const el = await page.$(sel)
    if (el) {
      priceText = await el.innerText()
      break
    }
  }

  if (!priceText) {
    throw new Error('Price not found on Amazon India')
  }

  const price = parseFloat(priceText.replace(/[^0-9.]/g, ''))

  return price
}
