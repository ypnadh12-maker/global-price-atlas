import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// --- Force load root .env ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../.env')
})

// --- Validate env ---
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ Missing Supabase ENV keys')
  process.exit(1)
}

if (!process.env.RESEND_KEY) {
  console.error('❌ Missing Resend ENV key')
  process.exit(1)
}

console.log('ENV URL:', process.env.SUPABASE_URL)

// --- Imports ---
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { runTarget } from './engine.js'

// --- Clients ---
const resend = new Resend(process.env.RESEND_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

console.log('Connected to:', process.env.SUPABASE_URL)

// --- Scraper ---
async function scrape() {
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })

  try {
    const { data: targets, error: targetError } = await supabase
      .from('scrape_targets')
      .select('*')

    if (targetError || !targets) {
      console.log('Target fetch error:', targetError)
      return
    }

    console.log('Targets found:', targets.length)

    for (const target of targets) {
      try {
        console.log('Scraping:', target.url)

        const price = await runTarget(target, browser)

        if (!price || isNaN(price)) {
          console.log('Invalid price, skipping')
          continue
        }

        console.log('Detected price:', price)

        // log success
        await supabase.from('scrape_logs').insert({
          target_id: target.id,
          status: 'success',
          message: 'Price scraped',
          price
        })

        // get last price
        const { data: last } = await supabase
          .from('price_history')
          .select('price')
          .eq('product_id', target.product_id)
          .order('recorded_at', { ascending: false })
          .limit(1)

        const lastPrice = last?.[0]?.price || null

        // insert new price
        await supabase.from('price_history').insert({
          product_id: target.product_id,
          retailer_id: target.retailer_id,
          price,
          currency: target.currency
        })

        console.log('Price inserted')

        // alert logic
        if (!lastPrice || price >= lastPrice) {
          console.log('No price drop')
          continue
        }

        console.log('🚨 PRICE DROP:', lastPrice, '→', price)

        const { data: subscribers } = await supabase
          .from('watchlists')
          .select('*')
          .eq('product_id', target.product_id)

        if (!subscribers || subscribers.length === 0) {
          console.log('No subscribers')
          continue
        }

        for (const sub of subscribers) {
          const { data: user } =
            await supabase.auth.admin.getUserById(sub.user_id)

          if (!user?.user?.email) continue

          await resend.emails.send({
            from: 'alerts@globalpriceatlas.com',
            to: [user.user.email],
            subject: 'Price Drop Alert 🚨',
            html: `
              <h2>Price Drop Detected</h2>
              <p>Old price: ${lastPrice}</p>
              <p>New price: ${price}</p>
            `
          })

          console.log('Email sent to:', user.user.email)
        }

        // log alert once
        await supabase.from('alerts').insert({
          product_id: target.product_id,
          old_price: lastPrice,
          new_price: price
        })

        console.log('Alert logged')

      } catch (e) {
        console.log('Scrape failed:', e.message)

        await supabase.from('scrape_logs').insert({
          target_id: target.id,
          status: 'error',
          message: e.message
        })
      }
    }

  } finally {
    await browser.close()
    console.log('Browser closed')
  }

  console.log('Scrape complete')
}

scrape()
