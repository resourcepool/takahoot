import { el } from "/node_modules/redom/dist/redom.es.js";
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
                this.changeTolerance = el("button.button", { title: "Change tolerance", disabled: true },
                    el("span.icon.is-small",
                        el("i.fas.fa-ruler")
                    )
                ),
            ]
        );

        this.enable.onclick = evt => {
            console.info('Enable bumper !');
            WebUSBService.write(targetIndex, "340" + bumperIndex)
        };

        this.disable.onclick = evt => {
            console.info('Disable bumper !');
            WebUSBService.write(targetIndex, "350" + bumperIndex)
        };

        this.changeTolerance.onclick = evt => {
            console.info('Change bumper tolerance !')
        };
    }
}