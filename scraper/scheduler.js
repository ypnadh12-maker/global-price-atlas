import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function schedule() {
  console.log('🕒 Scheduler running...')

  const { data: targets } = await supabase
    .from('scrape_targets')
    .select('id')

  if (!targets) {
    console.log('No targets found')
    return
  }

  for (const t of targets) {
    await supabase.from('scrape_queue').insert({
      target_id: t.id
    })
  }

  console.log(`Queued ${targets.length} jobs`)
}

schedule()
