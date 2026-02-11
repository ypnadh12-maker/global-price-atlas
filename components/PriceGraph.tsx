'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale)

export default function PriceGraph({ prices }: any) {
  const data = {
    labels: prices.map((p: any) =>
      new Date(p.recorded_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Price',
        data: prices.map((p: any) => p.price),
        borderColor: 'blue',
        tension: 0.3
      }
    ]
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Line data={data} />
    </div>
  )
}
