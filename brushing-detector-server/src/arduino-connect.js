const { SerialPort } = require("serialport");

const { ReadlineParser } = require("@serialport/parser-readline");

const connect = (handler) => {
  let port = new SerialPort({ path: 'COM9', baudRate: 9600 }); //Neme's port
  // let port = new SerialPort({ path: "COM4", baudRate: 9600 }); //kash's port
  // let port = new SerialPort({
  //   path: "/dev/tty.usbmodem1051DB2D6CE42",
  //   baudRate: 9600,
  // }); // Chrissy's port
  //let port = melodie's port (check in device manager for port)

  //FLOSSING PORTS - EVERYONE ADD
    let port2 = new SerialPort({ path: "COM10", baudRate: 115200 }); //Neme's port
  // let port2 = new SerialPort({ path: "COM16", baudRate: 115200 });//melodie's port (check in device manager for port) always 15. both are 15 for some reason
  // let port2 = new SerialPort({
  //   path: "/dev/cu.usbmodem1051DB36BC402",
  //   baudRate: 9600,
  // }); // Chrissy's port

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  const parser2 = port2.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  port.on("open", () => {
    console.log("Serial port opened. Listening...\n");
  });

  port2.on("open", () => {
    console.log("Serial port2 opened. Listening...");
  });

  parser.on("data", (line) => {
    handler(line, "arduino1"); // brushing
  });

  parser2.on("data", (line) => {
    console.log("Received from Arduino 2: ", line);
    handler(line, "arduino2"); // flossing
  });

  port.on("error", (err) => {
    console.log("Could not connect to Arduino 1");
    console.log(err);
  });

  port2.on("error", (err) => {
    console.log("Could not connect to Arduino 2");
    console.log(err);
  });

  return { port, port2 };
};

module.exports = connect;
