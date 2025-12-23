



export default function RawTelemetry() {

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
        <div className="w-full border border-amber-300 p-2">
            <h2 className="text-center font-bold mb-2">Raw Telemetry</h2>
                <div class="flex flex-row">
                    <div class="flex-1">
                        {dataCol1.map((item) => (
                            <div class="flex flex-row justify-between p-2 border-amber-200">
                                <p class="text-amber-700">{item}</p>
                                <p class="font-bold text-amber-900">--</p>
                            </div>
                        ))}
                    </div>
                    <div class="flex-1">
                        {dataCol2.map((item) => (
                            <div class="flex flex-row justify-between p-2 border-amber-200">
                                <p class="text-amber-700">{item}</p>
                                <p class="font-bold text-amber-900">--</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
}