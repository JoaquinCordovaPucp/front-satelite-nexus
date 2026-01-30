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



const socket = io("http://localhost:4500");

export default function App() {
    // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
    const [dataArrays, setDataArrays] = useState([]) // The format is the following: [[data1,data2,...],[data1,data2,...],...]
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

    const dataPoints = {
        dataPointVoltage: getNDataPoints(1),
        dataPointTemp: getNDataPoints(2)
    }

 

    return (
        <div class="w-full h-full bg-[#1C2A36] flex flex-row">
            <div class="w-1/4 h-full  flex flex-col p-2">
                <Titular />
                <MissionStage data={dataPoints} />
                <TelemetryChart name="Voltage" dataPoints={dataPoints.dataPointVoltage} />
                <TelemetryChart name="Temperature" dataPoints={dataPoints.dataPointTemp} />
            </div>
            <div class="w-1/2 h-full  p-2">
                <Stream streamUrl={streamUrl} />
                <div class="flex flex-row w-full">
                    <TelemetryChart name="Voltage" dataPoints={dataPoints.dataPointVoltage} />
                    <TelemetryChart name="Temperature" dataPoints={dataPoints.dataPointTemp} />	
                </div>	
            </div>
            <div class="w-1/4 h-full p-2">
                <RawTelemetry />
                <CommandPannel />
            </div>
        </div>
    )
}