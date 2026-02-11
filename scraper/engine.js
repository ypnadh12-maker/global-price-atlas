export async function runTarget(target, browser) {
  let adapterPath = './adapters/_shared/generic.js'

  if (target.adapter) {
    adapterPath = `./adapters/${target.adapter}.js`
  }

  console.log('Loading adapter:', target.adapter || '_shared/generic')

  let adapter

  try {
    adapter = await import(adapterPath)
  } catch (e) {
    console.log('⚠ Adapter not found. Falling back to generic.')
    adapter = await import('./adapters/_shared/generic.js')
  }

  if (!adapter.run) {
    throw new Error(`Adapter ${target.adapter} missing run()`)
  }

  const page = await browser.newPage()

  try {
    return await adapter.run(page, target)
  } finally {
    await page.close()
  }
}
