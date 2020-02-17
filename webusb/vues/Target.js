import { el } from "/node_modules/redom/dist/redom.es.js";
import TargetActions from "./TargetActions.js";
import Bumper from "./Bumper.js";

export default class Target {
    constructor(targetIndex) {
        this.el = el(".tile.is-parent.is-vertical",
            [
                el("h1.title", "Target " + targetIndex),
                [
                    new TargetActions(targetIndex),
                    el(".tile",
                        [
                            el(".tile.is-parent.is-vertical",
                                [
                                    new Bumper(targetIndex, 0),
                                    new Bumper(targetIndex, 1),
                                ]
                            ),
                            el(".tile.is-parent.is-vertical",
                                [
                                    new Bumper(targetIndex, 2),
                                    new Bumper(targetIndex, 3),
                                ]
                            )
                        ])
                ]
            ]
        );
    }
}