var serial = {};

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

    serial.Port.prototype.connect = function() {
        let readLoop = () => {
            const {
                endpointNumber
            } = this.device_.configuration.interfaces[0].alternate.endpoints[0]
            this.device_.transferIn(endpointNumber, 64).then(result => {
                this.onReceive(result.data);
                readLoop();
            }, error => {
                this.onReceiveError(error);
            });
        };

        return this.device_.open()
            .then(() => {
                if (this.device_.configuration === null) {
                    return this.device_.selectConfiguration(1);
                }
            })
            .then(() => this.device_.claimInterface(0))
            .then(() => {
                readLoop();
            });
    };

    serial.Port.prototype.disconnect = function() {
        return this.device_.close();
    };

    serial.Port.prototype.send = function(data) {
        const {
            endpointNumber
        } = this.device_.configuration.interfaces[0].alternate.endpoints[1]
        return this.device_.transferOut(endpointNumber, data);
    };
})();

let port;

function connect() {
    port.connect().then(() => {
        port.onReceive = data => {
            let textDecoder = new TextDecoder();
            console.log("Received:", textDecoder.decode(data));
            document.getElementById('output').value += textDecoder.decode(data);
        };
        port.onReceiveError = error => {
            console.error(error);
            document.querySelector("#connect").style = "visibility: initial";
            port.disconnect();
        };
    });
}

function send(string) {
    console.log("sending to serial:" + string.length);
    if (string.length === 0)
        return;
    console.log("sending to serial: [" + string +"]\n");

    let view = new TextEncoder('utf-8').encode(string);
    console.log(view);
    if (port) {
        port.send(view);
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
};
