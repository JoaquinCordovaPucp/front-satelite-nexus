import { useEffect, useState } from 'react';
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

const streamUrl = "http://localhost:3001/stream.mjpg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const socket = io("http://localhost:4500");

export default function App() {
    // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
    const [dataArrays, setDataArrays] = useState([])
    useEffect(() => {
        socket.on("rawTelemetry", (data) => {
            setDataArrays(prev => [...prev.slice(-50), data])
            // setRawTelemetry(data);
        }
    )
    return () => socket.off("rawTelemetry")
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

    const [dataPointVoltage, dataPointTemp] = [getNDataPoints(1), getNDataPoints(2)];

 

    return (
        <div class="w-full h-full bg-amber-50 flex flex-row">
            <div class="w-1/4 h-full bg-amber-600 flex flex-col p-2">
                <Titular />
                <MissionStage />
                <TelemetryChart name="Voltage" dataPoints={dataPointVoltage} />
                <TelemetryChart name="Temperature" dataPoints={dataPointTemp} />
            </div>
            <div class="w-1/2 h-full bg-green-50 p-2">
                <Stream streamUrl={streamUrl} />
                <div class="flex flex-row w-full">
                    <TelemetryChart name="Voltage" dataPoints={dataPointVoltage} />
                    <TelemetryChart name="Temperature" dataPoints={dataPointTemp} />	
                </div>	
            </div>
            <div class="w-1/4 h-full bg-red-500 p-2">
                <RawTelemetry />
                <CommandPannel />
            </div>
        </div>
    )
}