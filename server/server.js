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

const legacyTelemetryMap = {
    "Voltaje": "VOLT",
    "Inclinacion en X": "PITCH",
    "Inclinacion en Y": "ROLL",
    "Longitud": "LON",
    "Latitud": "LAT",
    "Tiempo Encendido": "TIME",
    "Velocidad Vertical": "VVEL",
    "Presion Atmosferica": "PRES",
    "Temperatura": "TEMP",
    "eCO2": "ECO2",
    "Indice Ultravioleta": "UV",
    "Aceleracion Angular en X": "GYRX",
    "Aceleracion Angular en Y": "GYRY",
    "Aceleracion Angular en Z": "GYRZ",
    "Altitud": "ALT",
}

const parseTelemetryValue = (value) => {
    if (value === undefined || value === null || value === "") {
        return ""
    }

    const parsedValue = Number(value)
    return Number.isNaN(parsedValue) ? value : parsedValue
}

const parseTelemetryLine = (line) => {
    const values = line.trim().split(",")

    return telemetryFieldNames.reduce((accumulator, fieldName, index) => {
        accumulator[fieldName] = parseTelemetryValue(values[index])
        return accumulator
    }, {})
}

const isTelemetryLine = (line) => {
    const values = line.trim().split(",")

    if (values.length !== telemetryFieldNames.length) {
        return false
    }

    return values.slice(0, 4).every((value) => value !== "" && !Number.isNaN(Number(value)))
}

const buildLegacyTelemetry = (packet) => {
    return Object.entries(legacyTelemetryMap).reduce((accumulator, [legacyKey, packetKey]) => {
        accumulator[legacyKey] = packet[packetKey] ?? ""
        return accumulator
    }, {})
}

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
            baudRate: 115200
        })
        currentPortPath = portPath

        // Ahora necesitamos un parser(lo importamos tmb)
        currentParser = new ReadlineParser()

        //Todo lo que le llege a al port, se lo pasamos(pipeamos) al parser
        currentPort.pipe(currentParser)

        currentParser.on('data', (line) => {
            const trimmedLine = line.trim()

            if (trimmedLine.length === 0) {
                return
            }

            if (!isTelemetryLine(trimmedLine)) {
                console.log("# ALERTA_ESTACION", trimmedLine)
                io.emit("stationAlert", {
                    message: trimmedLine,
                    raw: trimmedLine,
                    timestamp: Date.now(),
                })
                return
            }

            const packet = parseTelemetryLine(trimmedLine)
            const dataObject = buildLegacyTelemetry(packet)

            console.log(packet)
            stringifier.write(packet)

            io.emit("rawTelemetry", trimmedLine.split(","))
            io.emit("telemetry", dataObject)
        })
        isConfigReady = true
    })

    // Clean up if the socket disconnects entirely
    socket.on("disconnect", () => {
        console.log("Socket desconectado, puerto serial se mantiene abierto")
    })
})


const writeStream = fs.createWriteStream('output.csv')
const stringifier = csv.stringify({
    header: true,
        columns: telemetryFieldNames,
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
