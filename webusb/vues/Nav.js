import { el } from "/node_modules/redom/dist/redom.es.js";
import WebUSBService from "../WebUSBService.js";

export default class Nav {
    constructor(gameSelector) {
        this.el = el("nav.navbar", { role: "navigation", "aria-label": "main navigation" }, [
                el(".navbar-brand",
                    el("a.navbar-item", { href: "https://takahoot.takima.io" },
                        el("img", { src: "assets/resourcepool.png", width: 30, alt: "Takahoot" }))),
                el(".navbar-menu",
                    [
                        el(".navbar-start",
                            el("a.navbar-item", { href: "https://github.com/resourcepool" },
                                el("i.fab.fa-github"))
                        ),
                        el(".navbar-end", el(".navbar-item", el(".buttons",
                            [
                                this.connect = el("a.button.is-primary", "Connect"),
                                this.play = el("a.button", "Play"),
                                this.config = el("a.button", "Config"),
                            ]
                        )))
                    ]
                )
            ]
        );

        this.connect.onclick = evt => {
            console.info('Connect target !');
            WebUSBService.configureNewDevices().then(() => WebUSBService.connect);
        };
        this.play.onclick = evt => {
            console.info('Let\'s play !');
            //setAttr(gameSelector, { style: { display: "inline-flex" } });
        };

        this.config.onclick = evt => {
            console.info('Config !');
        };
    }
}