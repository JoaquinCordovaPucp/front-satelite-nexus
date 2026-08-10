const TELEMETRY_FLAGS = [
  {
    bit: 1 << 0,
    key: "FLAG_CALIDAD_AIRE_VALIDA",
    label: "Calidad de aire válida",
    group: "payload",
    important: false,
  },
  {
    bit: 1 << 1,
    key: "FLAG_RADIACION_UV_VALIDA",
    label: "Radiación UV válida",
    group: "payload",
    important: false,
  },
  {
    bit: 1 << 2,
    key: "FLAG_MOVIMIENTO_VALIDO",
    label: "Movimiento válido",
    group: "navigation",
    important: true,
  },
  {
    bit: 1 << 3,
    key: "FLAG_GPS_UBICACION_VALIDA",
    label: "GPS de ubicación válido",
    group: "navigation",
    important: true,
  },
  {
    bit: 1 << 4,
    key: "FLAG_GPS_VELOCIDAD_VALIDA",
    label: "GPS de velocidad válido",
    group: "navigation",
    important: true,
  },
  {
    bit: 1 << 5,
    key: "FLAG_PARACAIDAS_HABILITADO",
    label: "Paracaídas habilitado",
    group: "recovery",
    important: true,
  },
  {
    bit: 1 << 6,
    key: "FLAG_PARACAIDAS_ARMADO",
    label: "Paracaídas armado",
    group: "recovery",
    important: true,
  },
  {
    bit: 1 << 7,
    key: "FLAG_PARACAIDAS_PRIMERA_ETAPA",
    label: "Paracaídas 1ra etapa",
    group: "recovery",
    important: true,
  },
  {
    bit: 1 << 8,
    key: "FLAG_PARACAIDAS_SEGUNDA_ETAPA",
    label: "Paracaídas 2da etapa",
    group: "recovery",
    important: true,
  },
  {
    bit: 1 << 9,
    key: "FLAG_ATERRIZAJE_DETECTADO",
    label: "Aterrizaje detectado",
    group: "mission",
    important: true,
  },
]

const GROUP_LABELS = {
  mission: "Misión",
  navigation: "Navegación",
  payload: "Carga útil",
  recovery: "Recuperación",
}

const getFlagState = (flagsValue, bit) => (Number(flagsValue) & bit) === bit

export default function TelemetryFlagsPanel({ flagsValue = 0 }) {
  const numericFlags = Number(flagsValue) || 0
  const activeFlags = TELEMETRY_FLAGS.filter((flag) => getFlagState(numericFlags, flag.bit))
  const criticalFlags = TELEMETRY_FLAGS.filter((flag) => flag.important)

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">FLAGS de misión</h2>
          <p className="mt-1 text-xs text-slate-500">Estado binario interpretado en tiempo real</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {numericFlags}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
        {criticalFlags.map((flag) => {
          const isActive = getFlagState(numericFlags, flag.bit)
          const accentClasses = isActive
            ? flag.key === "FLAG_ATERRIZAJE_DETECTADO"
              ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-100"
              : flag.group === "recovery"
                ? "border-amber-400/25 bg-amber-400/12 text-amber-100"
                : "border-cyan-400/25 bg-cyan-400/12 text-cyan-100"
            : "border-white/5 bg-white/5 text-slate-500"

          return (
            <div key={flag.key} className={`rounded-2xl border px-3 py-2 ${accentClasses}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] opacity-70">
                  {GROUP_LABELS[flag.group]}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-current" : "bg-slate-700"}`} />
              </div>
              <p className="mt-2 text-sm font-medium leading-tight">{flag.label}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-3">
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Activas</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {activeFlags.length > 0 ? (
            activeFlags.map((flag) => (
              <span
                key={flag.key}
                className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100"
              >
                {flag.label}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">No hay banderas activas todavía.</span>
          )}
        </div>
      </div>
    </section>
  )
}