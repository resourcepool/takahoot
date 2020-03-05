import { mount } from "./node_modules/redom/dist/redom.es.js";
import WebUSBService from "./WebUSBService.js";
import Target from "./vues/Target.js";
import Nav from "./vues/Nav.js";
import GameSelector from "./vues/GameSelector.js";

window.onload = () => {
    let gameSelector = new GameSelector();

    mount(document.getElementById("game"), gameSelector);

    mount(document.getElementById("nav"), new Nav(gameSelector));

    WebUSBService.getDevices()
        .then(devices =>
            WebUSBService.connect().then(() => {
                devices.forEach((d, i) => {
                        mount(document.getElementById("targets"),
                            new Target(i));
                    });
                }));
};