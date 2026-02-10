import { ReadlineParser, SerialPort } from "serialport";
import { Server } from 'socket.io'
import fs from 'fs';
import * as csv from 'csv';
import express from 'express'
import cors from 'cors'

const expressPort = 4501
const socketPORT = 4500
const io = new Server(socketPORT, {
    cors: {origin: "*"}
})
const app = express()
app.use(cors())
app.use(express.json())


let isConfigReady = false
let currentPort = null
let currentParser = null
let currentPortPath = null
app.get("/config-status", (req, res) => {
  res.json({ isConfigReady });
});

app.post("/select-port", (req, res) => {
  const { portPath } = req.body;
  if(portPath === "disconnect") {
    isConfigReady = false
    return res.json({ success: true });
  }
  console.log("Puerto seleccionado:", portPath);
  // Aquí podrías agregar lógica adicional para manejar la selección del puerto
  res.json({ success: true });
})

app.listen(expressPort, () => {
  console.log("Servidor corriendo en puerto", expressPort);
});

io.on("connection", async (socket) => {
    try {
        const usbPortsList = await SerialPort.list()
        console.log("Puertos USB disponibles:", usbPortsList);
        socket.emit("usbPortsList", usbPortsList)
    } catch (error) {
        console.error("Error listando puertos USB:", error)
    }

    socket.on("usbSelection", (portPath) => {
        if(portPath === "disconnect") {
            // Close the serial port if it's open
            if(currentPort && currentPort.isOpen) {
                currentPort.close((err) => {
                    if(err) console.error("Error cerrando puerto:", err)
                    else console.log("Puerto cerrado correctamente")
                })
            }
            currentPort = null
            currentParser = null
            currentPortPath = null
            isConfigReady = false
            console.log("Desconectado del puerto serial")

            // Re-send the available ports so the user can pick again
            SerialPort.list().then(ports => {
                socket.emit("usbPortsList", ports)
            })
            return
        }

        console.log("Puerto seleccionado:", portPath);

        if(currentPort && currentPort.isOpen && currentPortPath === portPath) {
            console.log("Puerto ya abierto, reutilizando conexion")
            isConfigReady = true
            return
        }

        // Close existing port if switching
        if(currentPort && currentPort.isOpen) {
            currentPort.close()
        }

        //Creamos el objeto Serial Port desde un Inicio
        currentPort = new SerialPort({
            path: portPath,
            baudRate: 9600
        })
        currentPortPath = portPath

        // Ahora necesitamos un parser(lo importamos tmb)
        currentParser = new ReadlineParser()

        //Todo lo que le llege a al port, se lo pasamos(pipeamos) al parser
        currentPort.pipe(currentParser)

        currentParser.on('data', (line) => {
            const data = line.split(",")
            console.log(data)
            const dataObject = dataOrder.reduce((acc, key, index) => {
                acc[key] = data[index] ?? ""
                return acc
            }, {})
            stringifier.write(dataObject)

            io.emit("rawTelemetry", data)
            io.emit("telemetry", dataObject)
        })
        isConfigReady = true
    })

    // Clean up if the socket disconnects entirely
    socket.on("disconnect", () => {
        console.log("Socket desconectado, puerto serial se mantiene abierto")
    })
})



const dataOrder = [
  "Voltaje",                 //1
  "Inclinacion en X",        //2
  "Inclinacion en Y",        //3
  "Longitud",                //4
  "Latitud",                 //5
  "Tiempo Encendido",        //6
  "Velocidad Vertical",      //7
  "Presion Atmosferica",     //8
  "Temperatura",             //9
  "eCO2",                    //10
  "Indice Ultravioleta",     //11
  "Aceleracion Angular en X",//12
  "Aceleracion Angular en Y",//13
  "Aceleracion Angular en Z",//14
  "Altitud"                  //15
];

const writeStream = fs.createWriteStream('output.csv')
const stringifier = csv.stringify({
    header: true,
    columns: dataOrder,
})
stringifier.pipe(writeStream)
// const data = [
//   { name: "John", age: 25, city: "New York" },
//   { name: "Jane", age: 24, city: "San Francisco" },
//   { name: "Jim", age: 30, city: "Chicago" },
// ];
// csv.stringify(data, {
//     header: true,
//     columns: {
//         name: "name",
//         age: "age",
//         city: "city",
//     },
// })
// .pipe(writeStream);

// EXCUTE THIS COMMAND TO GET THE PATH OF YOUR SERIAL DEVICE
// ls /dev/tty.*

//Creamos el objeto Serial Port desde un Inicio
// const port =  new SerialPort({
//     path: "/dev/tty.usbmodem11301",
//     baudRate: 9600
// })

// // Ahora necesitamos un parser(lo importamos tmb)
// const parser = new ReadlineParser()


// //Todo lo que le llege a al port, se lo pasamos(pipeamos) al parser
// port.pipe(parser)


// parser.on('data', (line) => {
//     const data = line.split(",")
//     console.log(data)
//     const dataObject = dataOrder.reduce((acc, key, index) => {
//         acc[key] = data[index] ?? ""
//         return acc
//     }, {})
//     stringifier.write(dataObject)

//     io.emit("rawTelemetry", data)
//     io.emit("telemetry", dataObject)
// })  
