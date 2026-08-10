import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';  
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WINDOW_SECONDS = 12

const getPointTimeSeconds = (point, fallbackIndex) => {
  const rawTime = point?.timeSeconds ?? point?.milis ?? point?.TIME ?? point?.time ?? fallbackIndex
  const numericTime = Number(rawTime)

  return Number.isFinite(numericTime) ? numericTime : fallbackIndex
}

const getWindowedPoints = (points) => {
  if (!Array.isArray(points) || points.length === 0) {
    return []
  }

  const normalizedPoints = points.map((point, index) => ({
    ...point,
    timeSeconds: getPointTimeSeconds(point, index),
  }))

  const latestTime = normalizedPoints[normalizedPoints.length - 1].timeSeconds
  const windowStart = latestTime - WINDOW_SECONDS

  return normalizedPoints.filter((point) => point.timeSeconds >= windowStart)
}

const getChartPoints = (points) => {
  const windowedPoints = getWindowedPoints(points)

  if (windowedPoints.length === 0) {
    return []
  }

  const latestTime = windowedPoints[windowedPoints.length - 1].timeSeconds
  const earliestVisibleTime = latestTime - WINDOW_SECONDS
  const paddedPoints = [
    {
      timeSeconds: earliestVisibleTime,
      value: null,
    },
    ...windowedPoints,
  ]

  return paddedPoints
}

const buildDataset = ({ label, dataPoints, color }) => ({
  label,
  data: dataPoints.map((point) => ({
    x: Number((point.timeSeconds - dataPoints[dataPoints.length - 1].timeSeconds).toFixed(1)),
    y: point.value,
  })),
  borderColor: color,
  backgroundColor: `${color}22`,
  tension: 0.35,
  borderWidth: 2,
  pointRadius: 0,
  fill: false,
})

const buildChartOptions = (hasMultipleSeries) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      display: hasMultipleSeries,
      labels: {
        color: "#cbd5e1"
      }
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      borderColor: "rgba(148, 163, 184, 0.18)",
      borderWidth: 1,
      titleColor: "#f8fafc",
      bodyColor: "#e2e8f0"
    }
  },
  scales: {
    x: {
      type: "linear",
      min: -WINDOW_SECONDS,
      max: 0,
      ticks: {
        color: "#94a3b8",
        stepSize: 1,
        callback: (value) => `${Number(value).toFixed(0)}s`
      },
      grid: {
        color: "rgba(148, 163, 184, 0.08)"
      }
    },
    y: {
      beginAtZero: false,
      ticks: {
        color: "#94a3b8"
      },
      grid: {
        color: "rgba(148, 163, 184, 0.08)"
      }
    }
  }
})
// ]
export default function TelemetryChartNew({ name, dataPoints, milis, series, subtitle, unit, color = "#38bdf8" }) {
  const hasSeries = Array.isArray(series) && series.length > 0
  const primaryPoints = getChartPoints(hasSeries ? series[0].dataPoints : dataPoints)

  if (!primaryPoints || primaryPoints.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
        <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/30 text-[11px] text-slate-400">
          Cargando {name.toLowerCase()}...
        </div>
      </section>
    )
  }

  const latestValue = hasSeries
    ? primaryPoints[primaryPoints.length - 1]?.value
    : primaryPoints[primaryPoints.length - 1]?.value

  const chartData = {
    datasets: hasSeries
      ? series.map((item) => buildDataset({ ...item, dataPoints: getChartPoints(item.dataPoints) }))
      : [buildDataset({ label: name, dataPoints: primaryPoints, color })]
  }

  const options = buildChartOptions(hasSeries)

  return (
    <section className="rounded-2xl border border-white/10 bg-linear-to-br from-slate-950/85 via-slate-900/70 to-slate-950/90 p-2 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          {subtitle ? <p className="text-[9px] uppercase tracking-[0.26em] text-slate-500">{subtitle}</p> : null}
          <h2 className="text-sm font-semibold text-slate-50">{name}</h2>
        </div>
        {latestValue !== undefined && latestValue !== null ? (
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Último valor</p>
            <p className="text-sm font-semibold text-cyan-300">
              {Number.isFinite(Number(latestValue)) ? Number(latestValue).toFixed(2) : latestValue}
              {unit ? <span className="ml-1 text-[9px] text-slate-400">{unit}</span> : null}
            </p>
          </div>
        ) : null}
      </div>
      <div className="h-36">
        <Line data={chartData} options={options} />
      </div>
    </section>
  )
}


