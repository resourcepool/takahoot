import { el, setAttr } from "/node_modules/redom/dist/redom.es.js";
import WebUSBService from "../WebUSBService.js";

export default class BumperActions {

    constructor(targetIndex, bumperIndex) {
        this.el = el("p.buttons",
            [
                this.enable = el("button.button", { title: "Enable" },
                    el("span.icon.is-small",
                        el("i.fas.fa-check-circle")
                    )
                ),
                this.disable = el("button.button", { title: "Disable" },
                    el("span.icon.is-small",
                        el("i.fas.fa-unlink")
                    )
                ),
                this.changeTolerance = el("button.button", { title: "Change tolerance" },
                    el("span.icon.is-small",
                        el("i.fas.fa-ruler")
                    )
                ),
            ],
            this.toleranceSelector = el(".field.has-addons", [
                    el(".control",
                        this.tolerance = el("input.input", { type: "text", placeholder: "Enter tolerance 00 to ff" })),
                    el(".control",
                        this.sendTolerance = el("a.button.is-info", "Change")),
                ], { style: { display: "none" } }
            )
        );

        this.enable.onclick = evt => {
            console.info('Enable bumper !');
            WebUSBService.write(targetIndex, "340" + bumperIndex)
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.disable.onclick = evt => {
            console.info('Disable bumper !');
            WebUSBService.write(targetIndex, "350" + bumperIndex)
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };

        this.changeTolerance.onclick = evt => {
            if (!this.toleranceSelector.isDisplayed) {
                setAttr(this.toleranceSelector, { style: { display: "inline-flex" } });
                this.toleranceSelector.isDisplayed = true;
            } else {
                setAttr(this.toleranceSelector, { style: { display: "none" } });
                this.toleranceSelector.isDisplayed = false;
            }
        };

        this.tolerance.onkeypress = evt => {
            if (evt.key === "Enter") {
                this.sendTolerance.onclick();
            }
        };

        this.sendTolerance.onclick = evt => {
            console.info('Send bumper tolerance !')
            console.info(`Sending to bumper ${bumperIndex}, tolerance value: ${this.tolerance.value}`);
            WebUSBService.write(targetIndex, 320, bumperIndex)
                .catch(e => {
                    console.error("ERROR: " + e)
                });
        };
    }
}