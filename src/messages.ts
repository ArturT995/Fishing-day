import { ANCHOR, COLORS, fontConfigSmall } from "./constants";
import gm from "./gm";
import k from "./kaplayCtx";



export function message(text: string) {
    let random = k.randi(10, 15)
    let yAdd = 0;
    if (!gm.logPopupOpen) yAdd = -30
    const message = k.add([
        k.text(`${text}`, fontConfigSmall),
        k.pos(ANCHOR.x + random, ANCHOR.y+5 + yAdd),
        k.anchor("left"),
        k.color(COLORS.BEIGE),
        k.z(8),
        k.lifespan(2, { fade: 0.5 }),
        k.opacity(1),
        "message",
    ]);
    const targetPos = k.vec2(message.pos.x, message.pos.y - 10)
    k.tween(
            message.pos,
            targetPos,
            6,
            (p) =>  message.pos = p, k.easings.easeOutCubic
        )

    return message;
};