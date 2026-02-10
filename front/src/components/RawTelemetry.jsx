



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
        <div className="w-full border border-slate-600 p-2">
            <h2 className="text-center font-bold mb-2">Raw Telemetry</h2>
                <div class="flex flex-row">
                    <div class="flex-1">
                        {dataCol1.map((item, index) => (
                            <div class="flex flex-row justify-between p-2 border-slate-500" key={`col1-${index}`}>
                                <p class="">{item.title}</p>
                                <p class="font-bold ">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div class="flex-1">
                        {dataCol2.map((item, index) => (
                            <div class="flex flex-row justify-between p-2 border-slate-500" key={`col2-${index}`}>
                                <p class="">{item.title}</p>
                                <p class="font-bold ">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
}