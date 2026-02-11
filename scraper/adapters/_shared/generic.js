export async function run(target, browser) {
  console.log('🌍 Generic adapter')

  const page = await browser.newPage()

  await page.goto(target.url)
  await page.waitForSelector(target.selector)

  const text = await page
    .locator(target.selector)
    .first()
    .innerText()

  const price = parseFloat(text.replace(/[^0-9.]/g, ''))

  if (!price) throw new Error('Generic adapter failed')

  return price
}
