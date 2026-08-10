export default function Logs({ lines = [] }) {
    return(
        <section className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-slate-100 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Logs</h3>
                <span className="text-[10px] text-slate-500">Raw recibido</span>
            </div>
            <div className="max-h-36 overflow-auto rounded-xl border border-white/5 bg-slate-950/70 p-2 text-[10px] leading-4 text-slate-300">
                {lines.length > 0 ? lines.map((line, index) => (
                    <div key={`${index}-${line}`} className="border-b border-white/5 py-1 last:border-b-0">
                        {line}
                    </div>
                )) : (
                    <p className="text-slate-500">Esperando datos...</p>
                )}
            </div>
        </section>
    )
}