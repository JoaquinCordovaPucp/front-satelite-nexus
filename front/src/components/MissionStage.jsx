
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
        <div class="border border-slate-600 flex flex-col">
            <div class="flex flex-row gap-5 text-xl p-4 items-center bg-slate-500 border">
                <h2 class="text-xl font-bold  p-2">Etapa de la Misión: </h2>
                <p class="">Inicio</p>
            </div>
            <div class="flex flex-row text-sm text-white">
                <div class="flex-1">
                    {dataCol1.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-slate-500">
                            <p class="text-gray-200">{item.title} </p>
                            <p class="font-bold ">{item.value}<span class="text-xs ">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
                <div class="flex-1">
                    {dataCol2.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-slate-500">
                            <p class="text-gray-200">{item.title} </p>
                            <p class="font-bold ">{item.value}<span class="text-xs ">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
