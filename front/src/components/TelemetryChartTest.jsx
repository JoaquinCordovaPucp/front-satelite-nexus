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
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




export default function TelemetryChart({name, dataPoints}) {
  // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
  
  const labelsInt = [-50, -49, -48, -47, -46, -45, -44, -43, -42, -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28, -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0]
  const labels = labelsInt.map( label => label/2) // to have labels in seconds assuming data comes every 500ms

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
    animations: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }

  }
  return (
    <div className='w-full flex flex-col border border-amber-300 p-2'>
      <h1>{name}</h1>
      <Line data={data} options={options}/>
    </div>
  )
}


