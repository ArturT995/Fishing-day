import type { AnchorComp, AreaComp, Color, ColorComp, GameObj, 
            OpacityComp, PosComp, RectComp, RotateComp, 
            ScaleComp, SpriteComp, TextComp, ZComp } from "kaplay";

import { COLORS } from "./constants";
import k from "./kaplayCtx";


export type UIObject = StaticButton | DynamicButton | Container;

export type StaticButton = GameObj<
    PosComp & AnchorComp & ColorComp &
    AreaComp & ZComp & TextComp>;

export type DynamicButton = GameObj<
    PosComp & AnchorComp & ColorComp &
    AreaComp & ZComp & TextComp & ScaleComp | RotateComp>;

export type Container = GameObj<
    RectComp & PosComp & AnchorComp & ColorComp &
    AreaComp & ZComp & OpacityComp>;


export function makeButton(
    desc: string, fontSize: number,
    color: Color,
    container: Container, type: "static" | "dynamic") {

    let button: StaticButton | DynamicButton;

    if (type === "static") {
        button = container.add([
            k.text(`${desc}`, {font: "happy", size: fontSize}),
            k.anchor("center"),
            k.pos(container.width/2, container.height/2),
            k.color(color),
            k.area(),
            k.z(container.z+1),
        ]) as StaticButton;
    }

    else if (type === "dynamic") {
        button = container.add([
            k.text(`${desc}`, {font: "happy", size: fontSize}),
            k.anchor("center"),
            k.pos(container.width/2, container.height/2),
            k.color(color),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(container.z+1),
        ]) as DynamicButton;
    } else {
        throw new Error("invalid button type")
    }

    button.onHover(() => {
        hoverProcess(button)
    });

    button.onClick(() => {
        clickProcess(button)
    });

    return button;
}

export function alignObj(
    obj: UIObject, container: Container,
    offsetX: number, offsetY: number, padding: number,
    alignment: "center" | "left" | "right" |
    "top" | "bot" | "topleft" | "botleft" | "topright" | "botright" | "popbotright") {
    //objects start in the center, flip value if on right/bot

    let padX = padding + offsetX;
    let padY = padding + offsetY;
    let width = container.width/2
    let height = container.height/2

    if (alignment === "topleft") {
        obj.anchor = "topleft"
        obj.pos.x = -width + padX
        obj.pos.y = -height + padY
    }
    if (alignment === "topright") {
        obj.anchor = "topright"
        obj.pos.x = width + padX
        obj.pos.y = -height + padY
    }
    if (alignment === "left") {
        obj.pos.x = -width + padX
        obj.pos.y = 0 + padY
        obj.anchor = "left"
    }
    if (alignment === "bot") {
        obj.anchor = "bot"
        obj.pos.x = 0 + padX
        obj.pos.y = height - padY
    }
    if (alignment === "botright") {
        obj.anchor = "botright"
        obj.pos.x = width - padX
        obj.pos.y = height - padY
    }
    if (alignment === "popbotright") {
        obj.anchor = "bot"
        obj.pos.x = width - obj.width/2
        obj.pos.y = height - padY + obj.height
    }
}

export function makeContainer(
    anchor: "center" | "left" | "right" | "top" | "bot",
    color: Color,
    width: number, height: number,
    opacity: number, parent?: GameObj) {
    
    let container: Container;


    if(parent) {
        container = parent.add([
            k.rect(width, height),
            k.pos(parent.width/2, parent.height/2),
            k.anchor(anchor),
            k.color(color),
            k.area(),
            k.z(2+parent.z),
            k.opacity(opacity),
        ]);

    } else {
        container = k.add([
            k.rect(width, height),
            k.pos(k.center()),
            k.anchor(anchor),
            k.color(color),
            k.area(),
            k.z(2),
            k.opacity(opacity),
        ]);
    }
    return container;
}


export function makeSlider(
    name: string, padding: number, 
    anchor: string, offset: number, color: Color,
    container: Container) {
    
    
}




export function hoverProcess(obj: GameObj) {
    k.play("icon-sound-2",{volume: 0.5})
    const originalColor = obj.color
    obj.color = COLORS.YELLOW;
    obj.onHoverEnd(() => {
    obj.color = originalColor;
    });
}

export function clickProcess(obj: GameObj) {
    k.play("fishing-thunk",{volume: 0.5})
    obj.color = COLORS.GREEN;
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
