var serial = {};

const IN_ENDPOINT = 5; // In endpoint ID of WebUSB for Arduino
const OUT_ENDPOINT = 4; // Out endpoint ID of WebUSB for Arduino
const CONFIG_NUMBER = 1; // Device specific configuration value
const INTERFACE_NUMBER = 2; // Device specific interface number
const REQUEST_TYPE = 'class'; // industry-standard class of devices
const TRANSFER_RECIPIENT = "interface"; // target on the transfer on the device
const ARDUINO_CORE_REQUEST = 0x22; // see 'USBCore.h' > #define CDC_SET_CONTROL_LINE_STATE	0x22
const ARDUINO_CONTROL_CONNECT = 0x01; // Vendor-specific, 0x00 for DISCONNECT
const RECIPIENT_INTERFACE_NUMBER = 0x02; // Interface number on the recipient

(function() {
    'use strict';



    serial.getPorts = function() {
        return navigator.usb.getDevices().then(devices => {
            return devices.map(device => new serial.Port(device));
        });
    };

    serial.requestPort = function() {
        const filters = [
            { 'vendorId': 0x2fe3, 'productId': 0x0100 },
            { 'vendorId': 0x2fe3, 'productId': 0x00a },
            { 'vendorId': 0x8086, 'productId': 0xF8A1 },
            { 'vendorId': 0x2341, 'productId': 0x8036 }, // Arduino Leonardo <--- HERE WE ARE !
            { 'vendorId': 0x2341, 'productId': 0x8037 }, // Arduino Micro
            { 'vendorId': 0x2341, 'productId': 0x804d }, // Arduino/Genuino Zero
            { 'vendorId': 0x2341, 'productId': 0x804e }, // Arduino/Genuino MKR1000
            { 'vendorId': 0x2341, 'productId': 0x804f }, // Arduino MKRZERO
            { 'vendorId': 0x2341, 'productId': 0x8050 }, // Arduino MKR FOX 1200
            { 'vendorId': 0x2341, 'productId': 0x8052 }, // Arduino MKR GSM 1400
            { 'vendorId': 0x2341, 'productId': 0x8053 }, // Arduino MKR WAN 1300
            { 'vendorId': 0x2341, 'productId': 0x8054 }, // Arduino MKR WiFi 1010
            { 'vendorId': 0x2341, 'productId': 0x8055 }, // Arduino MKR NB 1500
            { 'vendorId': 0x2341, 'productId': 0x8056 }, // Arduino MKR Vidor 4000
            { 'vendorId': 0x2341, 'productId': 0x8057 }, // Arduino NANO 33 IoT
            { 'vendorId': 0x239A }, // Adafruit Boards!
        ];
        return navigator.usb.requestDevice({ 'filters': filters }).then(
            device => new serial.Port(device)
        );
    };

    serial.Port = function(device) {
        this.device_ = device;
    };


    serial.Port.prototype.connect = async function() {
        let readLoop = () => {
            const selectedInterface = this.device_.configuration.interfaces.filter((i) => i.claimed)[0];
            const {
                endpointNumber,
                packetSize
            } = selectedInterface.alternate.endpoints.filter(e => e.direction === "in")[0];
            this.device_.transferIn(endpointNumber, packetSize).then(result => {
                console.log("Ohh");
                this.onReceive(result.data);
                readLoop();
            }, error => {
            if (this.onReceiveError) {
                this.onReceiveError(error);
            } else {
                throw error;
            }

          });
        };

        const claimInterface = async (device) => {
          for (let i = 2; i < device.configurations[0].interfaces.length; i++) {
            let selectedInterface = device.configurations[0].interfaces[i];
            let interfaceNumber = selectedInterface.interfaceNumber;
            try {
              await device.claimInterface(interfaceNumber);
              console.log("Found interface");
              console.log(selectedInterface);
              return;
            } catch (error) {
              continue;
            }
          }
          throw "Aie";
        }

        const connectDevice = async (device) => {
          await device.open();
          await device.selectConfiguration(CONFIG_NUMBER);
          await device.claimInterface(INTERFACE_NUMBER);
          await device.controlTransferOut({
            requestType: REQUEST_TYPE,
            recipient: TRANSFER_RECIPIENT,
            request: ARDUINO_CORE_REQUEST,
            value: ARDUINO_CONTROL_CONNECT,
            index: RECIPIENT_INTERFACE_NUMBER
          });
          await device.controlTransferIn({
            requestType: REQUEST_TYPE,
            recipient: TRANSFER_RECIPIENT,
            request: ARDUINO_CORE_REQUEST,
            value: ARDUINO_CONTROL_CONNECT,
            index: RECIPIENT_INTERFACE_NUMBER
          }, 0);
          return await readLoop();
        }

        await connectDevice(this.device_);
    }

    serial.Port.prototype.disconnect = function() {
        return this.device_.close();
    };

    serial.Port.prototype.send = function(data) {
        const selectedInterface = this.device_.configuration.interfaces.filter((i) => i.claimed)[0];
        const {
            endpointNumber
        } = selectedInterface.alternate.endpoints.filter(e => e.direction === "out")[0];
        return this.device_.transferOut(endpointNumber, data);
    };
})();

let port;

function hexStringToByte(byteAsHexString) {
  return parseInt(byteAsHexString, 16);
}

/**
 * Converts a Hex String or a Pretty Hex String to an array of bytes (Uint8Array)
 * @param hexStr
 * @returns {Uint8Array}
 */
function hexStringToBytes(hexStr) {
  const SEPARATORS = new RegExp('[-:]', 'g');
  let str = hexStr.replace(SEPARATORS,'');
  let size = str.length / 2;
  let bytes = new Uint8Array(size + 2);
  for (let i = 0; i < size; ++i) {
    bytes[i] = hexStringToByte(str.substr(2 *  i, 2));
  }
  bytes[size] = 0x0D;
  bytes[size + 1] = 0x0A;
  return bytes;
}

function byteToHexString(byte) {
  return (((byte & 0xF0) >> 4).toString(16) + (byte & 0x0F).toString(16)).toLowerCase();
}

function bytesToPrettyHexString(dataview) {
  let hex = '';
  for (let i = 0; i < dataview.byteLength; i++) {
    let byte = dataview.getUint8(i);
    if (hex.length > 0) {
      hex += ':';
    }
    hex += byteToHexString(byte);
  }
  return hex.toLowerCase();
}

function connect() {
    port.connect().then(() => {
        port.onReceive = data => {
            console.log("Received:", data);
            document.getElementById('output').value += bytesToPrettyHexString(data) + '\r\n';
        };
        port.onReceiveError = error => {
            console.error(error);
            document.querySelector("#connect").style = "visibility: initial";
            port.disconnect();
        };
    });
}

function send(string) {
    string = string.trim();
    console.log("sending to serial:" + string.length);
    if (string.length === 0)
        return;
    console.log("sending to serial: [" + string +"]\n");
    const bytes = hexStringToBytes(string);
    console.log(bytes);
    if (port) {
        port.send(bytes);
    }
}

window.onload = () => {
    document.querySelector("#connect").onclick = function() {
        serial.requestPort().then(selectedPort => {
            port = selectedPort;
            this.style = "visibility: hidden";
            connect();
        });
    };

    document.querySelector("#submit").onclick = () => {
        let source = document.querySelector("#editor").value;
        send(source);
    }

    document.querySelector("#sendConnect").onclick = () => {
        document.querySelector("#editor").innerHTML = "30";
    }

    document.querySelector("#calibrate").onclick = () => {
        document.querySelector("#editor").innerHTML = "3100310131023103";
    }

    document.querySelector("#changeTolerance").onclick = () => {
        document.querySelector("#editor").innerHTML = "32XXYY";
    }

    document.querySelector("#enableTarget").onclick = () => {
        document.querySelector("#editor").innerHTML = "34XX";
    }

    document.querySelector("#disableTarget").onclick = () => {
        document.querySelector("#editor").innerHTML = "35XX";
    }

    document.querySelector("#disableTargetAndBlink").onclick = () => {
        document.querySelector("#editor").innerHTML = "36XX";
    }

    document.querySelector("#disableTargetsAndBlink").onclick = () => {
        document.querySelector("#editor").innerHTML = "37";
    }

    document.querySelector("#getState").onclick = () => {
        document.querySelector("#editor").innerHTML = "38";
    }

    document.querySelector("#reset").onclick = () => {
        document.querySelector("#editor").innerHTML = "3F";
    }
};
