import { el } from "/node_modules/redom/dist/redom.es.js";
import BumperActions from "./BumperActions.js";

const BUMPER_TYPES = ["is-danger", "is-info", "is-warning", "is-success"];

export default class Bumper {
    constructor(targetIndex, bumperIndex) {
        this.el = el("article.tile.is-child.notification.box." + BUMPER_TYPES[bumperIndex],
            [
                new BumperActions(targetIndex, bumperIndex)
            ]
        )
    }
}