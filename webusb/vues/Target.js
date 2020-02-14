import { el } from "/node_modules/redom/dist/redom.es.js";
import TargetActions from "./TargetActions.js";
import BumperActions from "./BumperActions.js";

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
                                    el("article.tile.is-child.notification.is-danger.box",
                                        [
                                            new BumperActions(targetIndex, 0)
                                        ]
                                    ),
                                    el("article.tile.is-child.notification.is-warning.box",
                                        [
                                            new BumperActions(targetIndex, 1)
                                        ]
                                    ),
                                ]
                            ),
                            el(".tile.is-parent.is-vertical",
                                [
                                    el("article.tile.is-child.notification.is-info.box",
                                        [
                                            new BumperActions(targetIndex, 2)
                                        ]
                                    ),
                                    el("article.tile.is-child.notification.is-success.box",
                                        [
                                            new BumperActions(targetIndex, 3)
                                        ]
                                    ),
                                ]
                            )
                        ])
                ]
            ]
        );
    }
}