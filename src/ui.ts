import type { AnchorComp, AreaComp, Color, ColorComp, FormattedText, GameObj, 
            OpacityComp, PosComp, RectComp, RotateComp, 
            ScaleComp, TextComp, ZComp } from "kaplay";

import { COLORS } from "./constants";
import k from "./kaplayCtx";
import gm from "./gm";
import { play } from "./sounds";
import { type FishObj, type ShopObj } from "./db";


export type UIObject = StaticButton | DynamicButton | Container;

export type StaticButton = GameObj<
    PosComp & AnchorComp & ColorComp & FormattedText &
    AreaComp & ZComp & TextComp>;

export type DynamicButton = GameObj<
    PosComp & AnchorComp & ColorComp & FormattedText &
    AreaComp & ZComp & TextComp & ScaleComp | RotateComp>;

export type Container = GameObj<any>;


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
            {
                grandparent: parent
            }
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
    
    if (!parent.parent) throw new Error("SliderError: Parent of parent not set.");
    
    let width = 1;
    let height = 1;
    let mousePos!: number; //constant "value not read warning here on new session, trying different fixes atm"
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
            if (type === "volume") {
                if ( value < 0.1) value = 0;
                onChange(value);
                gm.settings.musicVolume = value;
            } else {
                onChange(value);
            }
        }
    })

    k.onScroll((delta) => {
        if (parent.isHovering() || sliderBar.isHovering() || parent.grandparent.isHovering()) {
            let scrollSpeed = 7;
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






export function makeIcons(Container: any, popupObjects: GameObj[], data: FishObj[] | ShopObj[], ICON_COLS = 4, ICON_PADDING = 7 ): GameObj[] {

    const ICON_SIZE = 32;
    const POPUP_WIDTH = Container.width;
    const POPUP_HEIGHT = Container.height;
    const TOOLTIP_PADDING = 7;
    //const ICON_VAL = 0;

    let iconsList: GameObj[]
    iconsList = []

    data.forEach((obj, id) => {
        const col = id % ICON_COLS;
        const row = Math.floor(id / ICON_COLS);

        const startX = (Container.pos.x - POPUP_WIDTH / 2 + ICON_PADDING + ICON_SIZE) - 15;
        const startY = (Container.pos.y - POPUP_HEIGHT / 2 + ICON_PADDING + ICON_SIZE) - 15;

        let objLocked = obj.sprite
        if ("spriteLocked" in obj) {
            objLocked = obj.spriteLocked
        }

        const icon = k.add([
            k.sprite(obj.unlocked ? obj.sprite : objLocked),
            k.pos(startX + col * (ICON_SIZE + ICON_PADDING), startY + row * (ICON_SIZE + ICON_PADDING)),
            k.anchor("center"),
            k.area(),
            k.z(3),
            k.rotate(0),
            k.opacity(1),
            k.color(),
            {
                data: obj,
                baseY: 0,
            },
        ]);
        icon.baseY = icon.pos.y;

        const tooltip = k.add([
            k.rect(0, 0),
            k.pos(icon.pos.x + icon.width, icon.pos.y),
            k.anchor("center"),
            k.color(COLORS.DARKBLUE),
            k.outline(1),
            k.opacity(0),
            k.z(4),
        ]);

        const tooltipText = k.add([
            k.text("", {font: "happy", size: 6, width: 90}),
            k.pos(tooltip.pos.x, tooltip.pos.y),
            k.anchor("center"),
            k.color(COLORS.BEIGE),
            k.z(4),
            k.opacity(0)
        ]);
        

        icon.onHover(() => {
            k.play("icon-sound-2",{volume: 0.3})
            tooltip.opacity = 1;
            tooltipText.opacity = 1;
        });

        icon.onClick(() => {
            //add a shaking animation
            k.play("icon-sound-1",{volume: 0.5})
            tooltipText.opacity = 1;
        });

        icon.onHoverEnd(() => {
            tooltip.opacity = 0;
            tooltipText.opacity = 0;
        });

        icon.onUpdate(() => {
            if (icon.isHovering()) {
                if (!obj.unlocked && 'fishId' in data[0]) {
                        tooltipText.text = "???";
                        tooltipText.width = 0;
                } else {
                        tooltipText.text = `${obj.name}\n\n${obj.desc}`;
                }
            
                let tooltipTextInfo = k.formatText({
                    text: tooltipText.text,
                    font: "happy",
                    size: tooltipText.textSize,
                })

                if (tooltipTextInfo.width > tooltipText.width) {   
                    tooltipTextInfo = k.formatText({
                        text: tooltipText.text,
                        font: "happy",
                        size: tooltipText.textSize,
                        width: tooltipText.width,
                    })
                }
                tooltip.width = tooltipTextInfo.width + TOOLTIP_PADDING;
                tooltip.height = tooltipTextInfo.height + TOOLTIP_PADDING;  

                tooltip.pos.x = tooltip.width/2 + icon.pos.x + icon.width/2 + 2
                tooltipText.pos.x = tooltip.pos.x
                tooltip.pos.y = icon.pos.y + tooltip.height / 2 - + icon.height/2
                tooltipText.pos.y = tooltip.pos.y

                if (icon.pos.x + tooltip.width > k.width()) {
                    tooltip.pos.x = icon.pos.x - (icon.width / 2) - (tooltip.width / 2 + 2)
                    tooltipText.pos.x = tooltip.pos.x
                }
                if (icon.pos.y + tooltip.height > k.height()) {
                    tooltip.pos.y = icon.pos.y + (icon.height / 2) - (tooltip.height / 2 )
                    tooltipText.pos.y = tooltip.pos.y
                }
                
            }
            if (icon.pos.y + icon.height < Container.pos.y - icon.height/2 +4 || 
                icon.pos.y + icon.height > Container.pos.y/2 + Container.height
            ) {
                icon.opacity = 0;
                tooltip.opacity = 0;
                tooltipText.opacity = 0;
            } else {
                icon.opacity = 1;
            }
        });
        
        

        

        popupObjects.push(icon)
        popupObjects.push(tooltip)
        popupObjects.push(tooltipText)
        iconsList.push(icon)

        const ROW_HEIGHT = ICON_SIZE + ICON_PADDING
        let scrollY = 0;

        const totalRows = Math.ceil(data.length / ICON_COLS);
        const contentHeight = totalRows * ROW_HEIGHT;
        const visibleRows = Math.floor(POPUP_HEIGHT / ROW_HEIGHT);
        const visibleHeight = visibleRows * ROW_HEIGHT;
        const maxScroll = Math.max(0, contentHeight - visibleHeight);

        const scrollHandler = k.onScroll((delta) => {
            if (!Container.isHovering()) return;
            const direction = Math.sign(delta.y);
            scrollY += direction * ROW_HEIGHT;
            scrollY = k.clamp(scrollY, 0, maxScroll);
            

            iconsList.forEach(icon => {
                icon.pos.y = icon.baseY - scrollY;
            });
            icon.pos.y = icon.baseY - scrollY;

        });

    });

    return iconsList;
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
