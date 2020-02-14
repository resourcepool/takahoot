import { el } from "/node_modules/redom/dist/redom.es.js";
import WebUSBService from '../WebUSBService.js';

export default class TargetActions {

    constructor(targetIndex) {
        this.el = el("p.buttons",
            [
                this.connect = el("button.button", { title: "Connect" },
                    el("span.icon.is-small",
                        el("i.fas.fa-link")
                    )
                ),
                this.calibrate = el("button.button", { title: "Calibrate", disabled: true },
                    el("span.icon.is-small",
                        el("i.fas.fa-thermometer-half")
                    )
                ),
                this.disable = el("button.button", { title: "Disable & blink" },
                    el("span.icon.is-small",
                        el("i.fas.fa-unlink")
                    )
                ),
                this.getState = el("button.button", { title: "Get state" },
                    el("span.icon.is-small",
                        el("i.fas.fa-redo")
                    )
                ),
                this.reset = el("button.button", { title: "Reset" },
                    el("span.icon.is-small",
                        el("i.fas.fa-power-off")
                    )
                )
            ]
        );

        this.connect.onclick = evt => {
            console.info('Connect target !');
            WebUSBService.write(targetIndex, "30")
                .then(() => {
                    WebUSBService.read(targetIndex);
                })
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.calibrate.onclick = evt => {
            console.info('Calibrate target !');
        };

        this.disable.onclick = evt => {
            console.info('Disable target and blink !');
            WebUSBService.write(targetIndex, "37");
        };

        this.getState.onclick = evt => {
            console.info('Get target state !');
            WebUSBService.write(targetIndex, "38")
                .then(() => {
                    WebUSBService.read(targetIndex);
                })
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.reset.onclick = evt => {
            console.info('Reset target !');
            WebUSBService.write(targetIndex, "3F");
        }
    }
}