import type { GameObj } from "kaplay";
import { COLORS } from "./constants";
import k from "./kaplayCtx";



export function hoverProcess(obj: GameObj) {
    k.play("icon",{volume: 0.5})
    obj.color = k.rgb(COLORS.YELLOW);
    obj.onHoverEnd(() => {
    obj.color = k.rgb(COLORS.BEIGE);
    });
}

export function clickProcess(obj: GameObj) {
    k.play("thunk",{volume: 0.5})
    obj.color = k.rgb(COLORS.GREEN);
}


export function bubbleText(obj: GameObj) {
    return k.loop(4, () => {
        k.tween(
            1,
            1.1,
            2,
            (s) => (obj.scale.x = obj.scale.y = s),
            k.easings.easeOutQuad
        ).then(() => {
            k.tween(
                1.1,
                1,
                2,
                (s) => (obj.scale.x = obj.scale.y = s),
                k.easings.easeInQuad
            );
        })
    })

}
