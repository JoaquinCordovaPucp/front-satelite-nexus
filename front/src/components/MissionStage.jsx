
export default function MissionStage({ data }) {
    const dataCol1 = [
    {
        title: "Batt:",
        unit: "V"
    },
    {
        title: "Pressure:",
        unit: "hPa"
    },
    {
        title: "Mis. State:",
        unit: ""
    },
    {
        title: "Vel:",
        unit: "m/s"
    },
    {
        title: "GPS Sats:",
        unit: ""
    },
    {
        title: "Acel:",
        unit: "m/s²"
    }
    ];
    const dataCol2 = [
    {
        title: "Tel. Signal:",
        unit: "dBm"
    },
    {
        title: "Altitude:",
        unit: "m"
    },
    {
        title: "Cam. Signal:",
        unit: "%"
    },
    {
        title: "Latt:",
        unit: "°"
    },
    {
        title: "Long:",
        unit: "°"
    },
    {
        title: "Temp:",
        unit: "°C"
    }
    ]
    return (
        <div class="border border-amber-300 flex flex-col">
            <div class="flex flex-row gap-5 text-xl p-4">
                <h2 class="text-xl font-bold text-amber-800 p-2 bg-amber-200 bg ">Etapa de la Misión</h2>
                <p class="">Inicio</p>
            </div>
            <div class="flex flex-row text-sm text-white">
                <div class="flex-1">
                    {dataCol1.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-amber-200">
                            <p class="text-gray-200">{item.title} </p>
                            <p class="font-bold ">{data.dataPointVoltage.at(-1)}<span class="text-xs ">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
                <div class="flex-1">
                    {dataCol2.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-amber-200">
                            <p class="text-gray-200">{item.title} </p>
                            <p class="font-bold ">--<span class="text-xs ">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
