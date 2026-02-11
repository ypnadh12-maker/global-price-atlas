export default {
  scrape: async (target, browser) => {
    const page = await browser.newPage()

    await page.goto(target.url, { waitUntil: 'networkidle' })

    const text = await page.textContent('#priceblock_ourprice')

    const price = parseFloat(
      text.replace(/[^0-9.]/g, '')
    )

    await page.close()

    return price
  }
}
