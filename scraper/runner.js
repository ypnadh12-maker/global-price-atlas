import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { runTarget } from './engine.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function runQueue() {
  console.log('🚀 Runner started')

  const browser = await chromium.launch({ headless: true })

  try {
    const { data: jobs } = await supabase
      .from('scrape_queue')
      .select('*')
      .eq('status', 'pending')
      .limit(5)

    if (!jobs || jobs.length === 0) {
      console.log('No jobs in queue')
      return
    }

    for (const job of jobs) {
      await supabase
        .from('scrape_queue')
        .update({ status: 'running' })
        .eq('id', job.id)

      const { data: target } = await supabase
        .from('scrape_targets')
        .select('*')
        .eq('id', job.target_id)
        .single()

      try {
        const price = await runTarget(target, browser)

        await supabase.from('scrape_logs').insert({
          target_id: target.id,
          status: 'success',
          message: 'Queued scrape success',
          price
        })

        await supabase
          .from('scrape_queue')
          .update({ status: 'done' })
          .eq('id', job.id)

        console.log('✅ Job done:', job.id)

      } catch (e) {
        await supabase.from('scrape_logs').insert({
          target_id: target.id,
          status: 'error',
          message: e.message
        })

        await supabase
          .from('scrape_queue')
          .update({ status: 'error' })
          .eq('id', job.id)

        console.log('❌ Job failed:', job.id)
      }
    }

  } finally {
    await browser.close()
  }
}

runQueue()
