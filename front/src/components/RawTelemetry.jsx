
export default function RawTelemetry({ data = {} }) {
    const entries = Object.entries(data)

    const dataCol1 = entries.slice(0, 6).map(([key, value]) => ({
        title: `${key}:`,
        value
    }))
    const dataCol2 = entries.slice(6, 12).map(([key, value]) => ({
        title: `${key}:`,
        value
    }))
    return (
        <section className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Raw telemetry</h2>
                <span className="text-xs text-slate-500">Último paquete</span>
            </div>
            <div className="flex flex-row gap-3 text-sm">
                <div className="flex-1 space-y-2">
                    {dataCol1.map((item, index) => (
                        <div className="flex flex-row justify-between rounded-2xl border border-white/5 bg-white/5 px-3 py-2" key={`col1-${index}`}>
                            <p className="text-slate-400">{item.title}</p>
                            <p className="font-medium text-slate-50">{item.value}</p>
                        </div>
                    ))}
                </div>
                <div className="flex-1 space-y-2">
                    {dataCol2.map((item, index) => (
                        <div className="flex flex-row justify-between rounded-2xl border border-white/5 bg-white/5 px-3 py-2" key={`col2-${index}`}>
                            <p className="text-slate-400">{item.title}</p>
                            <p className="font-medium text-slate-50">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}