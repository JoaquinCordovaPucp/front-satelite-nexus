import { ReadlineParser, SerialPort } from "serialport";
import { Server } from 'socket.io'

const io = new Server(4500, {
    cors: {origin: "*"}
})






//Creamos el objeto Serial Port desde un Inicio
const port =  new SerialPort({
    path: "/dev/tty.usbmodem1201",
    baudRate: 9600
})

// Ahora necesitamos un parser(lo importamos tmb)
const parser = new ReadlineParser()


//Todo lo que le llege a al port, se lo pasamos(pipeamos) al parser
port.pipe(parser)


parser.on('data', (line) => {
    const data = line.split(",")
    console.log(data)
    io.emit("rawTelemetry", data)
})  
