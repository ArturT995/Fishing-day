import type { AnchorComp, AreaComp, Color, ColorComp, FormattedText, GameObj, 
            OpacityComp, PosComp, RectComp, RotateComp, 
            ScaleComp, TextComp, ZComp } from "kaplay";

import { COLORS } from "./constants";
import k from "./kaplayCtx";
import gm from "./gm";
import { play } from "./sounds";


export type UIObject = StaticButton | DynamicButton | Container;

export type StaticButton = GameObj<
    PosComp & AnchorComp & ColorComp & FormattedText &
    AreaComp & ZComp & TextComp>;

export type DynamicButton = GameObj<
    PosComp & AnchorComp & ColorComp & FormattedText &
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
        bubbleText(button)
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
    

    let padX = padding + offsetX;
    let padY = padding + offsetY;
    let width = container.width/2
    let height = container.height/2
    // objects start in the center, flip value if on left/top
    // a value of 0 means center

    if (alignment === "center") {
        obj.anchor = "center"
        obj.pos.x = 0
        obj.pos.y = 0
    }
    if (alignment === "left") {
        obj.anchor = "center"
        obj.pos.x = -width + padX + obj.width/2
        obj.pos.y = 0
    }
    if (alignment === "right") {
        obj.anchor = "center"
        obj.pos.x = width - padX - obj.width/2
        obj.pos.y = 0
    }
    if (alignment === "top") {
        obj.anchor = "center"
        obj.pos.x = 0
        obj.pos.y = -height + padY + obj.height/2
    }
    if (alignment === "bot") {
        obj.anchor = "center"
        obj.pos.x = 0
        obj.pos.y = height - padY - obj.height/2
    }
    if (alignment === "topleft") {
        obj.anchor = "center"
        obj.pos.x = -width + padX + obj.width/2
        obj.pos.y = -height + padY + obj.height/2
    }
    if (alignment === "botleft") {
        obj.anchor = "center"
        obj.pos.x = -width + padX + obj.width/2
        obj.pos.y = height - padY - obj.height/2
    }
    if (alignment === "topright") {
        obj.anchor = "center"
        obj.pos.x = width - padX - obj.width/2
        obj.pos.y = -height + padY + obj.height/2
    }
    if (alignment === "botright") {
        obj.anchor = "center"
        obj.pos.x = width - padX - obj.width/2
        obj.pos.y = height - padY - obj.height/2
    }
    if (alignment === "popbotright") {
        obj.anchor = "center"
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






//add more types
export function makeSlider(
    color: Color, parent: Container, 
    direction: "vertical" | "horizontal", 
    type: "scroll" | "volume", onChange: (val: number) => void) {
    
    let width = 1;
    let height = 1;
    let mousePos: number;
    let dragging = false;
    let posX = 0;
    let posY = 0;
    let value = 0;
    let initialX = 0;

    mousePos = 0;

    if (direction === "vertical") {
        mousePos = k.mousePos().y;
        width = parent.width
        height = parent.height / 4
        if (type === "volume") {
            height = parent.height / 8
        }
        posX = 0;
        posY = -(parent.height / 2) + (height / 2);
    }
    if (direction === "horizontal") {
        mousePos = k.mousePos().x;
        width = parent.width / 4
        height = parent.height
        if (type === "volume") {
            width = parent.width / 8
            initialX = 0 + (gm.settings.musicVolume * width);
        }
        posX = (parent.width / 2) - (width / 2);
        posY = 0;

        if (type === "volume") {
            posX = initialX
        }
    }

    let sliderBar = parent.add([
        k.rect(width, height),
        k.anchor("center"),
        k.color(color),
        k.pos(posX, posY),
        k.area(),
        k.z(parent.z+1),
    ])

    sliderBar.onUpdate(() => {
        if (k.isMousePressed("left") && parent.isHovering() ) {
            dragging = true;
        }
        if (k.isMouseReleased("left")) {
            dragging = false;
        }
        
        
        if (dragging) {
            const worldMouse = k.toWorld(k.mousePos());
            const parentCenter = parent.toWorld(k.vec2(0, 0));
            let limit = 0;

            if (direction === "horizontal") {
                limit = parent.width / 2 - sliderBar.width / 2;
                let localX = worldMouse.x - parentCenter.x;
                sliderBar.pos.x = k.clamp(localX, -limit, limit);
                value = k.map(sliderBar.pos.x, -limit, limit, 0, 1);
            }
            if (direction === "vertical") {
                limit = parent.height / 2 - sliderBar.height / 2;
                const localY = worldMouse.y - parentCenter.y;
                sliderBar.pos.y = k.clamp(localY, -limit, limit);
                value = k.map(sliderBar.pos.y, -limit, limit, 0, 1);
            }
            if ( value < 0.1) value = 0;
            onChange(value);
            gm.settings.musicVolume = value;
        }
    })
    k.onScroll((delta) => {

    if (parent.isHovering() || sliderBar.isHovering()) {
        const scrollSpeed = 7;
        
        if (direction === "vertical") {
            const limit = (parent.height / 2) - (sliderBar.height / 2);

            sliderBar.pos.y = k.clamp(sliderBar.pos.y + (delta.y / scrollSpeed), -limit, limit);
            
            const val = k.map(sliderBar.pos.y, -limit, limit, 0, 1);
            onChange(val);
        } else {
            const limit = (parent.width / 2) - (sliderBar.width / 2);
            sliderBar.pos.x = k.clamp(sliderBar.pos.x + (delta.y / scrollSpeed), -limit, limit);
            
            const val = k.map(sliderBar.pos.x, -limit, limit, 0, 1);
            onChange(val);
        }
    }
    });

    sliderBar.onMouseRelease(() => {
        if (type === "volume") {
            gm.saveProgress();
        }
    });

    return sliderBar;
}









export function hoverProcess(obj: GameObj) {
    play("icon-sound-2", "sfx", -0.5)
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
