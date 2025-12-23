
export default function MissionStage() {
    const dataCol1 = [
        "Batt:",
    "Pressure:",
    "Mis. State:",
    "Vel:",
    "GPS Sats:",
    "Acel:",

    ];
    const dataCol2 = [
    "Tel. Signal:",
    "Altitude:",
    "Cam. Signal:",
    "Latt:",
    "Long:",
    "Temp:"
    ]
    return (
        <div class="border border-amber-300 flex flex-col">
            <div class="flex flex-row gap-5 text-xl p-4">
                <h2 class="text-xl font-bold text-amber-800 p-2 bg-amber-200 bg ">Etapa de la Misión</h2>
                <p class="">Inicio</p>
            </div>
            <div class="flex flex-row">
                <div class="flex-1">
                    {dataCol1.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-amber-200">
                            <p class="text-amber-700">{item}</p>
                            <p class="font-bold text-amber-900">--</p>
                        </div>
                    ))}
                </div>
                <div class="flex-1">
                    {dataCol2.map((item) => (
                        <div class="flex flex-row justify-between p-2 border-t border-amber-200">
                            <p class="text-amber-700">{item}</p>
                            <p class="font-bold text-amber-900">--</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
