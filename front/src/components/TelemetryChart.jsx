import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const socket = io("http://localhost:3001");

export default function TelemetryChart({Name}) {
  const [dataPoints, setDataPoints] = useState([]);
  const [labels, setLabels] = useState([]);
  const counterRef = useRef(0);

  useEffect(() => {
    socket.on("telemetry", (line) => {
      const value = parseFloat(line);
      if (isNaN(value)) return;

      counterRef.current += 1;

      setDataPoints(prev => [...prev.slice(-20), value]);
      setLabels(prev => [...prev.slice(-20), counterRef.current]);
    });

    return () => socket.off("telemetry");
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Dato del Arduino",
        data: dataPoints,
        borderColor: "#3b82f6",
        tension: 0.3,
        animations: false
      }
    ]
  };

  const options = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full border border-amber-300 p-2">
      <h2>{Name}</h2>
      <Line data={data} options={options} />
    </div>
  );
}
