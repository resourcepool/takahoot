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
                this.enableAll = el("button.button", { title: "Enable all" },
                    el("span.icon.is-small",
                        el("i.fas.fa-check-circle")
                    )
                ),
                this.calibrateAll = el("button.button", { title: "Calibrate all" },
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
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.enableAll.onclick = evt => {
            console.info('Calibrate all bumpers !');
            [0, 1, 2, 3].forEach(i => WebUSBService.write(targetIndex, "340" + i));
        };

        this.calibrateAll.onclick = evt => {
            console.info('Calibrate all bumpers !');
            [0, 1, 2, 3].forEach(i => WebUSBService.write(targetIndex, "310" + i));
        };

        this.disable.onclick = evt => {
            console.info('Disable target and blink !');
            WebUSBService.write(targetIndex, "37")
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.getState.onclick = evt => {
            console.info('Get target state !');
            WebUSBService.write(targetIndex, "38")
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.reset.onclick = evt => {
            console.info('Reset target !');
            WebUSBService.write(targetIndex, "3f")
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        }
    }
}