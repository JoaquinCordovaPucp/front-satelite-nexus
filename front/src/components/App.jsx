import { use, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';  
import TelemetryChart from './TelemetryChartTest.jsx';

import Stream from '../components/Stream.jsx'
import RawTelemetry from '../components/RawTelemetry.jsx';
import CommandPannel from '../components/CommandPannel.jsx';   
import MissionStage from './MissionStage.jsx'; 
import Titular from './Titular.jsx';
import TelemetryChartNew from './TelemetryChartTestcopy.jsx';
import Logs from './Logs.jsx';
import CuboThree from './Cubito.js';

const streamUrl = "http://192.168.1.38";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dataOrder = ["voltaje", "inclinacionX", "inclinacionY"]

const backendUrl = "http://localhost:4500" // Cambia esto por la URL de tu backend

const socket = io(backendUrl);
let dataObj = []
let storeData = {}
let milis = 0
export default function App() {
    // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
    const [dataArrays, setDataArrays] = useState([])
    const [latestData, setLatestData] = useState({})
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
            // setRawTelemetry(data);
        }
    )
    return () => socket.off("rawTelemetry")
    }, [])
    useEffect(() => {
        socket.on("telemetry", (data) => {
            setLatestData(data)
            dataObj.push(data)
            dataObj = dataObj.slice(-50)
            // console.log(data, "dataObj")
            milis = data["Tiempo Encendido"]
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

    const getNDataPoints = (n) => {
        const dataPoints = dataArrays.map( dataArray => {
        if(dataArray){
        return (dataArray[n])
        } else {
            return 0
        }
        })
        return dataPoints
    }

    const dataPoints = {
        dataPointVoltage: getNDataPoints(1),
        dataPointTemp: getNDataPoints(2)
    }

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
        milis = 0
        socket.emit("usbSelection", "disconnect")
    }

    if(isLoading) {
        console.log(esPuertoSeleccionado, "esPuertoSeleccionado in loading")
        return (
        <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
            <h1 class="text-2xl font-bold">Nexus Spadce 📡</h1>
            <p class="text-lg">Cargando...{isLoading}</p>
        </div>
    )}

    if(!esPuertoSeleccionado) {
        return (
            <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
                <h1 class="text-2xl font-bold">Nexus Space 📡</h1>
                <p class="text-lg">Selecciona el puerto USB al que está conectado el satélite:</p>
                {puertos.length > 0 && (
                    <div class="flex flex-col gap-2 mt-4">
                        {puertos.map((puerto, index) => (
                            <button key={index} onClick={() => handlePuertoSeleccionado(puerto.path)} class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
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
            <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
                <h1 class="text-2xl font-bold">Nexus Space 📡</h1>
                <p class="text-lg">Cargando datos del satélite...</p>
                <button class="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mt-4" onClick={handleDisconnect}>
                    Desconectar Receptor
                </button>
            </div>
        )
    }

    return (
        <div class="w-full h-full bg-gray-950 flex flex-row text-white">
            <div class="w-1/4 h-full  flex flex-col p-2">
                <Titular MET={(milis / 1000).toFixed(2)}/>
                <MissionStage data={latestData} />
                {/* <TelemetryChart name="Voltage" dataPoints={dataPoints.dataPointVoltage} /> */}
                <TelemetryChartNew name="Temperatura" dataPoints={storeData["Temperatura_datapoints"]} milis={milis}/>
            </div>
            <div class="w-1/2 h-full  p-2">
                <Stream streamUrl={streamUrl} />
                <div class="flex flex-row w-full">
                    <TelemetryChart name="Voltage" dataPoints={dataPoints.dataPointVoltage} />
                    <TelemetryChart name="Temperature" dataPoints={dataPoints.dataPointTemp} />	
                </div>	
                <CuboThree />
            </div>
            <div class="w-1/4 h-full p-2">
                <RawTelemetry data={latestData} />
                <CommandPannel />
                <button class="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mt-4" onClick={handleDisconnect}>
                    Desconectar Receptor
                </button>
                <Logs />
            </div>
        </div>
    )}
