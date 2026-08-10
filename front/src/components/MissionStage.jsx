
export default function MissionStage({ data }) {
    // const dataCol1 = [
    // {
    //     title: "Batt:",
    //     unit: "V"
    // },
    // {
    //     title: "Pressure:",
    //     unit: "hPa"
    // },
    // {
    //     title: "Mis. State:",
    //     unit: ""
    // },
    // {
    //     title: "Vel:",
    //     unit: "m/s"
    // },
    // {
    //     title: "GPS Sats:",
    //     unit: ""
    // },
    // {
    //     title: "Acel:",
    //     unit: "m/s²"
    // }
    // ];
    // const dataCol2 = [
    // {
    //     title: "Tel. Signal:",
    //     unit: "dBm"
    // },
    // {
    //     title: "Altitude:",
    //     unit: "m"
    // },
    // {
    //     title: "Cam. Signal:",
    //     unit: "%"
    // },
    // {
    //     title: "Latt:",
    //     unit: "°"
    // },
    // {
    //     title: "Long:",
    //     unit: "°"
    // },
    // {
    //     title: "Temp:",
    //     unit: "°C"
    // }
    // ]

    const dataCol1 = Object.entries(data).slice(0,6).map(([key, value]) => ({
        title: `${key}:`,
        unit: key === "voltaje" ? "V" : key === "presion" ? "hPa" : key === "velocidad" ? "m/s" : key === "gpsSats" ? "" : key === "aceleracion" ? "m/s²" : "",
        value: value
    }))

    const dataCol2 = Object.entries(data).slice(6, 12).map(([key, value]) => ({
        title: `${key}:`,
        unit: key === "senalTel" ? "dBm" : key === "altitud" ? "m" : key === "senalCam" ? "%" : key === "latitud" ? "°" : key === "longitud" ? "°" : key === "temperatura" ? "°C" : "",
        value: value
    }))
    return (
        <section className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Etapa de la misión</h2>
                <p className="text-xs text-slate-500">Inicio</p>
            </div>
            <div className="flex flex-row gap-3 text-sm">
                <div className="flex-1 space-y-2">
                    {dataCol1.map((item, index) => (
                        <div className="flex flex-row justify-between rounded-2xl border border-white/5 bg-white/5 px-3 py-2" key={`stage-1-${index}`}>
                            <p className="text-slate-400">{item.title}</p>
                            <p className="font-medium text-slate-50">{item.value}<span className="ml-1 text-xs text-slate-400">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
                <div className="flex-1 space-y-2">
                    {dataCol2.map((item, index) => (
                        <div className="flex flex-row justify-between rounded-2xl border border-white/5 bg-white/5 px-3 py-2" key={`stage-2-${index}`}>
                            <p className="text-slate-400">{item.title}</p>
                            <p className="font-medium text-slate-50">{item.value}<span className="ml-1 text-xs text-slate-400">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
