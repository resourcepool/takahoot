import { el } from "/node_modules/redom/dist/redom.es.js";
import TargetActions from "./TargetActions.js";
import Bumper from "./Bumper.js";

export default class Target {
    constructor(targetIndex) {
        this.el = el(".tile.is-ancestor.box",
            el(".tile.is-parent.is-vertical",
                [
                    el(".tile.is-child", el("h1.title", "Target " + targetIndex)),
                    el(".tile.is-child", new TargetActions(targetIndex)),
                    el(".tile.is-horizontal", [
                        new Bumper(targetIndex, 0),
                        new Bumper(targetIndex, 1),
                    ]),
                    el(".tile.is-horizontal", [
                        new Bumper(targetIndex, 2),
                        new Bumper(targetIndex, 3),
                    ]),
                ]
            )
            , { style: { "margin-bottom": "30px" } });
    }
}