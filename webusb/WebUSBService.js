const ARDUINO_VENDOR_ID = 0x2341;
const ARDUINO_PRODUCT_ID = 0x8036;
const IN_ENDPOINT = 5; // In endpoint ID of WebUSB for Arduino (4 for Out endpoint)
const CONFIG_NUMBER = 1; // Device specific configuration value
const INTERFACE_NUMBER = 2; // Device specific interface number
const REQUEST_TYPE = 'class'; // industry-standard class of devices
const TRANSFER_RECIPIENT = "interface"; // target on the transfer on the device
const ARDUINO_CORE_REQUEST = 0x22; // see 'USBCore.h' > #define CDC_SET_CONTROL_LINE_STATE	0x22
const ARDUINO_CONTROL_CONNECT = 0x01; // Vendor-specific, 0x00 for DISCONNECT
const RECIPIENT_INTERFACE_NUMBER = 0x02; // Interface number on the recipient
const BUFFER_LENGTH = 64; // Interface number on the recipient

class WebUSBService {

    constructor(){
        if(! WebUSBService.instance) {
            this._devices = [];
            WebUSBService.instance = this;
        }
        return WebUSBService.instance;
    }

    async connect() {
        try {
            if (this._devices && this._devices.length > 0) {
                for (let [index, device] of this._devices.entries()) {
                    device.index = index;
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
                    device.serialSubscriber = new SerialSubscriber();
                    this.subscribe(device);
                }
            }
        } catch (e) {
            console.error(`Error while setting up the devices:\n${e.toString()}`);
            throw e;
        }
    };

    // Get the plugged devices and extract the one having the Arduino's vendor id, then asks the user
    // to choose from the resulting list
    async configureNewDevices() {
        const authorizedDevice = await navigator.usb.requestDevice({
            filters: [{ vendorId: ARDUINO_VENDOR_ID, productId: ARDUINO_PRODUCT_ID }]
        });
        this._devices.push(authorizedDevice);
    };

    async getDevices() {
        this._devices = await navigator.usb.getDevices();
        /*FOR TEST:/ this._devices = [{open: () => {}, selectConfiguration: () => {}, claimInterface: () => {}, controlTransferOut: () => {}, controlTransferIn: () => {}}];*/
        return this._devices;
    }

    async write(deviceIndex, message) {
        const selectedInterface = this._devices[deviceIndex].configuration.interfaces.filter((i) => i.claimed)[0];
        const {
            endpointNumber
        } = selectedInterface.alternate.endpoints.filter(e => e.direction === "out")[0];
        console.info('Writing message: ' + message);
        return this._devices[deviceIndex].transferOut(endpointNumber, hexStringToBytes(message));
    }

    async subscribe(device) {
        device.transferIn(IN_ENDPOINT, BUFFER_LENGTH).then(payload => {
            device.serialSubscriber.onReceive(device, payload.data);
            this.subscribe(device);
        }, error => {
            device.serialSubscriber.onReceiveError(error);
        });
    }
}

const instance = new WebUSBService();

export default instance;

function hexStringToByte(byteAsHexString) {
    return parseInt(byteAsHexString, 16);
}

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

function bytesToPrettyHexString(bytes) {
    let hex = '';
    for (let byte of bytes.values()) {
        if (hex.length > 0) {
            hex += ':';
        }
        hex += byteToHexString(byte);
    }
    return hex.toLowerCase();
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

class SerialSubscriber {
    onReceive = (device, data) => {
        console.info('SerialSubscriber received data: ');
        const decoder = new TextDecoder();
        const out = buf2hex(data.buffer);
        let cmd, b0, b1, b2, b3;
        if (out.length === 30) {
            cmd = out.substring(0, 2);
            b0 = out.substring(2, 8);
            b1 = out.substring(8, 14);
            b2 = out.substring(14, 20);
            b3 = out.substring(20, 26);
            device.state = {
                cmd, b0, b1, b2, b3
            };

            switch(cmd) {
                case "84"://OUT_COMPUTER_TARGET_HIT
                    let hit = [b0, b1, b2, b3].filter(s => s.indexOf("09") > 0);//identify bumper
                    let hitIndex = hit[0].substring(1,2);
                    console.info(`Target ${device.index} hit bumper ${hitIndex}`);
                    if (device.kahootSession) {
                        device.kahootSession.answerQuestion(hitIndex);
                    }
                    break;
                case "88"://OUT_COMPUTER_CONTROLLER_STATE
                    console.info(`Reading #getState target ${device.index} - state: ${device.state}`);
                    break;
                case "82"://OUT_COMPUTER_CALIBRATION_FINISHED
                    console.info(`Reading #calibrationFinished target ${device.index} - state: ${device.state}`);
                    break;
                case "81"://OUT_COMPUTER_CALIBRATION_STARTED
                    console.info(`Reading #calibrationStarted target ${device.index} - state: ${device.state}`);
                    break;
                case "80"://OUT_COMPUTER_CONNECTED
                    console.info(`Reading #computerConnected target ${device.index} - state: ${device.state}`);
                    break;
            }
        }
    };

    onReceiveError = (error) => {
        console.error('SerialSubscriber received error: ');
        console.error(error);
    };
}