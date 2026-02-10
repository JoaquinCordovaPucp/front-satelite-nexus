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

// [
//     {
//         "value": "341",
//         "milis": "10014"
//     },
//     {
//         "value": "340",
//         "milis": "10515"
//     },
//     {
//         "value": "340",
//         "milis": "11016"
//     },
//     {
//         "value": "340",
//         "milis": "11516"
//     },
//     {
//         "value": "340",
//         "milis": "12018"
//     },
//     {
//         "value": "341",
//         "milis": "12519"
//     },
//     {
//         "value": "341",
//         "milis": "13020"
//     },
//     {
//         "value": "341",
//         "milis": "13520"
//     },
//     {
//         "value": "340",
//         "milis": "14021"
//     },
//     {
//         "value": "341",
//         "milis": "14522"
//     },
//     {
//         "value": "340",
//         "milis": "15023"
//     },
//     {
//         "value": "340",
//         "milis": "15523"
//     }
// ]


export default function TelemetryChartNew({name, dataPoints, milis}) {
  // const [rawTelemetry, setRawTelemetry] = useState(initialArray);
  
  if(!dataPoints || dataPoints.length === 0) {
    // console.log(dataPoints, "caca")
    return <div>Loading...</div>
  }
  // console.log(dataPoints, "dataPoints in TelemetryChartNew")
  const data = {
    labels: dataPoints.map(point => ((milis - point.milis) / 1000).toFixed(1) * (-1)), // Convert milis to seconds and format to 2 decimal places
    datasets: [
      {
        label: "Dato del Arduino",
        data: dataPoints.map( point => point.value),
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
    <div className='w-full flex flex-col border border-slate-600 p-2'>
      <h1>{name}</h1>
      <Line data={data} options={options}/>
    </div>
  )
}


