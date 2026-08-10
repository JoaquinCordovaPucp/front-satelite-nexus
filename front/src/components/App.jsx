import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

import Stream from '../components/Stream.jsx'
import RawTelemetry from '../components/RawTelemetry.jsx';
import CommandPannel from '../components/CommandPannel.jsx';   
import MissionStage from './MissionStage.jsx'; 
import Titular from './Titular.jsx';
import TelemetryChartNew from './TelemetryChartTestcopy.jsx';
import TelemetryFlagsPanel from './TelemetryFlagsPanel.jsx';
import GpsMapPanel from './GpsMapPanel.jsx';
import Logs from './Logs.jsx';
import CuboThree from './Cubito.js';

const streamUrl = "http://192.168.1.80/stream";

const backendUrl = "http://localhost:4500" // Cambia esto por la URL de tu backend

const socket = io(backendUrl);
let dataObj = []
let storeData = {}
let rawStoreData = {}
let milis = 0
const telemetryFieldNames = [
    "TYPE",
    "SEQ",
    "TIME",
    "FLAGS",
    "VOLT",
    "PITCH",
    "ROLL",
    "LON",
    "LAT",
    "VVEL",
    "PRES",
    "TEMP",
    "ECO2",
    "ETOH",
    "AQI",
    "UV",
    "GYRX",
    "GYRY",
    "GYRZ",
    "ACCX",
    "ACCY",
    "ACCZ",
    "ALT",
    "CHK",
]

const getDatapoints = (key) => storeData[`${key}_datapoints`] ?? []

const getRawDatapoints = (key) => rawStoreData[`${key}_datapoints`] ?? []

const getLatestValue = (key, fallback = "—") => {
    const datapoints = getDatapoints(key)

    if (datapoints.length === 0) {
        return fallback
    }

    return datapoints[datapoints.length - 1]?.value ?? fallback
}

const smoothDatapoints = (points, windowSize = 5) => {
    if (!points || points.length === 0) {
        return []
    }

    return points.map((point, index) => {
        const startIndex = Math.max(0, index - windowSize + 1)
        const windowPoints = points.slice(startIndex, index + 1)
        const average = windowPoints.reduce((sum, currentPoint) => sum + Number(currentPoint.value ?? 0), 0) / windowPoints.length

        return {
            ...point,
            value: Number.isFinite(average) ? Number(average.toFixed(3)) : point.value
        }
    })
}

const formatValue = (value, digits = 2) => {
    const numericValue = Number(value)
    if (Number.isFinite(numericValue)) {
        return numericValue.toFixed(digits)
    }

    return value ?? "—"
}

const parseTelemetryPacket = (rawData) => {
    if (!Array.isArray(rawData)) {
        return {}
    }

    return telemetryFieldNames.reduce((packet, fieldName, index) => {
        const value = rawData[index]
        const numericValue = Number(value)
        packet[fieldName] = value === undefined || value === "" || Number.isNaN(numericValue) ? value : numericValue
        return packet
    }, {})
}

const appendTimeSeriesPoint = (seriesKey, value, timeSeconds) => {
    if (!rawStoreData[seriesKey]) {
        rawStoreData[seriesKey] = []
    }

    rawStoreData[seriesKey].push({ value, timeSeconds })

    const cutoffTime = Number(timeSeconds) - 30
    rawStoreData[seriesKey] = rawStoreData[seriesKey].filter((point) => Number(point.timeSeconds) >= cutoffTime)
}

export default function App() {
    // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
    const [dataArrays, setDataArrays] = useState([])
    const [latestData, setLatestData] = useState({})
    const [latestPacket, setLatestPacket] = useState({})
    const [rawLines, setRawLines] = useState([])
    const [stationAlerts, setStationAlerts] = useState([])
    const [esPuertoSeleccionado, setEsPuertoSeleccionado] = useState(false)
    const [puertos, setPuertos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    
    
    // The format is the following: [[data1,data2,...],[data1,data2,...],...]
    useEffect(() => {
        socket.on("usbPortsList", (ports) => {
            setPuertos(ports)
            // Aquí puedes actualizar el estado de tu aplicación con la lista de puertos USB
            // Por ejemplo, podrías mostrar esta lista en un componente para que el usuario seleccione uno
        });
    }, [])

    useEffect(() => {
        fetch("http://localhost:4501/config-status")
        .then(r => r.json())
        .then(data => {
            if(data.isConfigReady === true) {
                setEsPuertoSeleccionado(true)
            }
            setIsLoading(false)
        })
    }, [])
    
    useEffect(() => {
        socket.on("rawTelemetry", (data) => {
            setDataArrays(prev => [...prev.slice(-50), data])
            setRawLines(prev => [...prev.slice(-30), Array.isArray(data) ? data.join(",") : String(data)])
            const parsedPacket = parseTelemetryPacket(data)
            setLatestPacket(parsedPacket)
            milis = Number(parsedPacket.TIME ?? milis)

            for (const [key, value] of Object.entries(parsedPacket)) {
                appendTimeSeriesPoint(
                    `${key}_datapoints`,
                    value,
                    Number(parsedPacket.TIME ?? milis)
                )
            }
            // setRawTelemetry(data);
        }
    )
    return () => socket.off("rawTelemetry")
    }, [])

    useEffect(() => {
        socket.on("stationAlert", (alert) => {
            const message = typeof alert === "string" ? alert : alert?.message ?? alert?.raw ?? "Alerta de estación"
            setStationAlerts(prev => [...prev.slice(-5), message])
            setRawLines(prev => [...prev.slice(-30), `ALERTA: ${message}`])
        })

        return () => socket.off("stationAlert")
    }, [])
    useEffect(() => {
        socket.on("telemetry", (data) => {
            setLatestData(data)
            dataObj.push(data)
            dataObj = dataObj.slice(-50)
            // console.log(data, "dataObj")
            for (const [key, value] of Object.entries(data)) {
                if(!storeData[`${key}_datapoints`]){
                    storeData[`${key}_datapoints`] = []
                }
                storeData[`${key}_datapoints`].push({value, milis: milis})
                storeData[`${key}_datapoints`] = storeData[`${key}_datapoints`].slice(-50)
            }
            // console.log(storeData, "storeData")
        })
    }, [])

    const telemetryForMotion = latestPacket

    const summaryCards = [
        {
            label: "Secuencia",
            value: formatValue(telemetryForMotion["SEQ"] ?? latestData["SEQ"], 0)
        },
        {
            label: "Tiempo",
            value: `${formatValue(telemetryForMotion["TIME"] ?? latestData["Tiempo Encendido"], 1)} s`
        },
        {
            label: "Voltaje",
            value: `${formatValue(telemetryForMotion["VOLT"] ?? latestData["Voltaje"], 2)} V`
        },
        {
            label: "Temperatura",
            value: `${formatValue(telemetryForMotion["TEMP"] ?? latestData["Temperatura"], 2)} °C`
        },
        {
            label: "Presión",
            value: `${formatValue(telemetryForMotion["PRES"] ?? latestData["Presion Atmosferica"], 2)} hPa`
        },
        {
            label: "Altitud",
            value: `${formatValue(telemetryForMotion["ALT"] ?? latestData["Altitud"], 2)} m`
        }
    ]

    const flagsValue = telemetryForMotion["FLAGS"] ?? latestData["FLAGS"] ?? 0

    const chartCards = [
        {
            name: "Altura",
            subtitle: "Altitud suavizada",
            unit: "m",
            color: "#38bdf8",
            dataPoints: smoothDatapoints(getRawDatapoints("ALT"), 5)
        },
        {
            name: "Velocidad vertical",
            subtitle: "Movimiento en eje Z",
            unit: "m/s",
            color: "#f59e0b",
            dataPoints: getRawDatapoints("VVEL")
        },
        {
            name: "Aceleración vertical",
            subtitle: "Componente Z",
            unit: "m/s²",
            color: "#fb7185",
            dataPoints: getRawDatapoints("ACCZ")
        },
        {
            name: "Inclinación",
            subtitle: "Pitch y roll",
            unit: "°",
            series: [
                {
                    label: "Pitch",
                    dataPoints: getRawDatapoints("PITCH"),
                    color: "#22c55e"
                },
                {
                    label: "Roll",
                    dataPoints: getRawDatapoints("ROLL"),
                    color: "#a78bfa"
                }
            ]
        }
    ]

    // console.log(dataPoints, "dataPoints")
    // console.log(storeData, "storeData in App.jsx")
    const handlePuertoSeleccionado = (portPath) => {
        console.log("Puerto seleccionado:", portPath);
        setEsPuertoSeleccionado(true)
        socket.emit("usbSelection", portPath)
    }

    const handleDisconnect = () => {
        setEsPuertoSeleccionado(false)
        setLatestData({})
        setDataArrays([])
        dataObj = []
        storeData = {}
        rawStoreData = {}
        milis = 0
        setRawLines([])
        setLatestPacket({})
        socket.emit("usbSelection", "disconnect")
    }

    if(isLoading) {
        console.log(esPuertoSeleccionado, "esPuertoSeleccionado in loading")
        return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-wide">Nexus Space</h1>
            <p className="text-sm text-slate-400">Cargando estación a tierra...</p>
        </div>
    )}

    if(!esPuertoSeleccionado) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center gap-4 px-4">
                <h1 className="text-4xl font-semibold tracking-[0.2em] uppercase">Nexus Space</h1>
                <p className="max-w-xl text-center text-sm text-slate-400">Selecciona el puerto USB al que está conectado el satélite para comenzar la recepción en vivo.</p>
                {puertos.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur">
                        {puertos.map((puerto, index) => (
                            <button key={index} onClick={() => handlePuertoSeleccionado(puerto.path)} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-800/90">
                                {puerto.path}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if(!latestData || Object.keys(latestData).length === 0) {
        console.log(esPuertoSeleccionado, "esPuertoSeleccionado in loading")
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center gap-4 px-4">
                <h1 className="text-4xl font-semibold tracking-[0.2em] uppercase">Nexus Space</h1>
                <p className="text-sm text-slate-400">Cargando datos del satélite...</p>
                <button className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/15 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/25" onClick={handleDisconnect}>
                    Desconectar Receptor
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-4 px-3 py-3 lg:px-4">
                <header className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">Estación a tierra</p>
                            <h1 className="mt-1 text-2xl font-semibold text-slate-50">Nexus Space</h1>
                            <p className="mt-1 max-w-2xl text-xs text-slate-400">
                                Telemetría en vivo, visualizada con una interfaz más limpia y sutil.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-200">
                                Puerto activo
                            </div>
                            <button className="rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/25" onClick={handleDisconnect}>
                                Desconectar receptor
                            </button>
                        </div>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
                        {summaryCards.map((item) => (
                            <div key={item.label} className="rounded-xl border border-white/8 bg-slate-950/50 px-3 py-2">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-50">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    {stationAlerts.length > 0 && (
                        <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                            <span className="mr-2 text-[10px] uppercase tracking-[0.22em] text-amber-200/80">Aviso</span>
                            {stationAlerts[stationAlerts.length - 1]}
                        </div>
                    )}
                </header>

                <div className="grid flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="flex flex-col gap-4">
                        <section className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                            <Titular MET={Number.isFinite(Number(milis)) ? Number(milis).toFixed(2) : "0.00"}/>
                        </section>
                        <TelemetryFlagsPanel flagsValue={flagsValue} />
                        <GpsMapPanel
                            latitude={telemetryForMotion.LAT ?? latestData["LAT"] ?? latestData["Latitud"]}
                            longitude={telemetryForMotion.LON ?? latestData["LON"] ?? latestData["Longitud"]}
                        />
                        <MissionStage data={latestData} />
                        <RawTelemetry data={latestData} />
                        <section className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                            <CommandPannel />
                        </section>
                    </aside>

                    <main className="flex min-w-0 flex-col gap-4">
                        <section className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-2">
                            {chartCards.map((chart) => (
                                <TelemetryChartNew
                                    key={chart.name}
                                    name={chart.name}
                                    subtitle={chart.subtitle}
                                    unit={chart.unit}
                                    color={chart.color}
                                    dataPoints={chart.dataPoints}
                                    series={chart.series}
                                    milis={milis}
                                />
                            ))}
                        </section>

                        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                                <Stream streamUrl={streamUrl} />
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                                <CuboThree telemetry={telemetryForMotion} />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
                            <Logs lines={rawLines} />
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )}
