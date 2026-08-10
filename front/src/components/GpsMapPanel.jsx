const toNumber = (value) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

const buildEmbedUrl = (latitude, longitude) => {
  const delta = 0.0015
  const west = longitude - delta
  const south = latitude - delta
  const east = longitude + delta
  const north = latitude + delta

  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${latitude}%2C${longitude}`
}

export default function GpsMapPanel({ latitude, longitude }) {
  const lat = toNumber(latitude)
  const lon = toNumber(longitude)

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-slate-100 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">GPS</h2>
          <p className="mt-1 text-[11px] text-slate-500">Posición detallada</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-100">
          zoom 18
        </span>
      </div>

      {lat !== null && lon !== null ? (
        <>
          <div className="mb-2 rounded-xl border border-white/5 overflow-hidden bg-slate-900">
            <iframe
              title="GPS map"
              src={buildEmbedUrl(lat, lon)}
              className="h-32 w-full border-0"
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
            <span>LAT {lat.toFixed(7)}</span>
            <span>LON {lon.toFixed(7)}</span>
          </div>
        </>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/30 text-[11px] text-slate-500">
          Esperando coordenadas GPS
        </div>
      )}
    </section>
  )
}