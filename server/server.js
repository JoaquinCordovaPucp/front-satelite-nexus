const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { Server } = require("socket.io");

// 1. Servidor WebSocket
const io = new Server(3001, {
  cors: { origin: "*" }
});

console.log("Servidor WebSocket en puerto 3001");

const port = new SerialPort({
  path: "/dev/tty.usbmodem11301", // Linux: /dev/ttyUSB0, macOS: /dev/ttyUSB0 or /dev/ttyACM0
  baudRate: 9600
});

const parser = new ReadlineParser()

port.pipe(parser);

// 3. Recibir datos del Arduino
parser.on("data", line => {
  console.log("Arduino:", line);
  io.emit("telemetry", line);
});
