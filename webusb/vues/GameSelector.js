import { el, setAttr } from "/node_modules/redom/dist/redom.es.js";
import KahootSession from "../kahoot-service/KahootSession.js";
import WebUSBService from "../WebUSBService.js";

export default class GameSelector {
    constructor() {
        this.el = el(".field.has-addons", [
                el(".control",
                    this.gamePin = el("input.input", { type: "text", placeholder: "Enter game pin" })),
                el(".control",
                    this.connect = el("a.button.is-info", "Connect")),
            ]
        );

        this.connect.onclick = evt => {
            console.info('Connecting to game: ' + this.gamePin.value);
            setAttr(this.connect, "disabled", true);
            setAttr(this.gamePin, "disabled", true);
            WebUSBService.getDevices()
                .then(devices => {
                    devices.forEach((d, i) => {
                        d.kahootSession = new KahootSession(this.gamePin.value, "Target " + i, i);
                    });
                });
        };
    }
}