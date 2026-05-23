import type { Color, GameObj } from "kaplay";

import { COLORS } from "./constants";
import k from "./kaplayCtx";
import gm from "./gm";
import { playSound } from "./sounds";
import { ROD_DATA, type BagObj, type FishObj, type RodObj, type ShopObj } from "./db";


// sets base position bottom right then posX and posY are subtracted.
export function makeButton(
    desc: string, fontSize: number,
    color: Color,
    container: GameObj, type: "static" | "dynamic",
    posX: number, posY: number,
    interactable = true) {

    let button: GameObj;

    if (type === "static") {
        button = container.add([
            k.text(`${desc}`, {font: "happy", size: fontSize}),
            k.anchor("center"),
            k.pos(container.width/2 - posX, container.height/2 - posY),
            k.color(color),
            k.area(),
            k.opacity(1),
            k.z(container.z+1),
            `${desc}`
        ]) as GameObj;
    }

    else if (type === "dynamic") {
        button = container.add([
            k.text(`${desc}`, {font: "happy", size: fontSize}),
            k.anchor("center"),
            k.pos(container.width/2, container.height/2),
            k.color(color),
            k.area(),
            k.scale(1),
            k.opacity(1),
            k.rotate(0),
            k.z(container.z+1),
            `${desc}`
        ]) as GameObj;
        bubbleText(button)
    } else {
        throw new Error("invalid button type")
    }

    button.onHover(() => {
        if (interactable) hoverProcess(button);
    });

    button.onClick(() => {
        if (interactable) clickProcess(button)
    });

    return button;
}







// this causes some bugs, best to not use it.(currently used in slider positioning where it works)
function alignObj(
    obj: GameObj, container: GameObj,
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
    
    let container: GameObj;

    if(parent) {
        container = parent.add([
            k.rect(width, height),
            k.pos(parent.width/2 - width/2, parent.height/2 - height/2),
            k.anchor(anchor),
            k.color(color),
            k.area(),
            k.opacity(1),
            k.z(3+parent.z),
            k.opacity(opacity),
            "container",
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
            k.z(3),
            k.opacity(opacity),
            "container",
        ]);
    }
    return container;
}







export function makeSlider(
    color: Color, parent: GameObj, 
    direction: "vertical" | "horizontal", 
    type: "musicVolume" | "sfxVolume", onChange: (val: number) => void) {
    
    if (!parent.parent) throw new Error("SliderError: Parent of parent not set.");
    
    let dragging = false;
    let width = (direction === "horizontal") ? parent.width / 8 : parent.width;
    let height = (direction === "vertical") ? parent.height / 8 : parent.height;

    const limit = (direction === "horizontal") 
        ? (parent.width / 2 - width / 2) 
        : (parent.height / 2 - height / 2);

    // startVal is between 0-1
    let startVal = 0.5;
    if (type === "musicVolume") startVal = gm.settings.musicVolume;
    if (type === "sfxVolume") startVal = gm.settings.sfxVolume;


    let posX = 0;
    let posY = 0;
    if (direction === "horizontal") {
        posX = k.map(startVal, 0, 1, -limit, limit);
    } else {
        posY = k.map(startVal, 0, 1, -limit, limit);
    }

    let sliderBar = parent.add([
        k.rect(width, height),
        k.anchor("center"),
        k.color(color),
        k.pos(posX, posY),
        k.area(),
        k.z(parent.z + 1),
    ]);

    sliderBar.onUpdate(() => {
        const bounds = parent.screenPos();
    
        const isMouseOverParent = (
            k.mousePos().x >= bounds.x - parent.width / 2 &&
            k.mousePos().x <= bounds.x + parent.width / 2 &&
            k.mousePos().y >= bounds.y - parent.height / 2 &&
            k.mousePos().y <= bounds.y + parent.height / 2
        );

        if (k.isMousePressed("left") && isMouseOverParent) dragging = true;
        if (k.isMouseReleased("left")) dragging = false;
        if (dragging) {
            const worldMouse = k.toWorld(k.mousePos());
            const parentCenter = parent.toWorld(k.vec2(0, 0));
            let val = 0;

            if (direction === "horizontal") {
                let localX = worldMouse.x - parentCenter.x;
                sliderBar.pos.x = k.clamp(localX, -limit, limit);
                val = k.map(sliderBar.pos.x, -limit, limit, 0, 1);
            } else {
                let localY = worldMouse.y - parentCenter.y;
                sliderBar.pos.y = k.clamp(localY, -limit, limit);
                val = k.map(sliderBar.pos.y, -limit, limit, 0, 1);
            }

            if (val < 0.1) val = 0;


            if (type === "musicVolume") {
                gm.settings.musicVolume = val;
            } else if (type === "sfxVolume") {
                gm.settings.sfxVolume = val;
            }

            onChange(val);
        }
    });
    
    sliderBar.onMouseRelease(() => {
        if (type === "musicVolume" || type === "sfxVolume") {
            gm.saveProgress();
        }
    });


    k.onScroll((delta) => {
        const bounds = parent.screenPos();
        const isMouseOverParent = (
            k.mousePos().x >= bounds.x - parent.width / 2 &&
            k.mousePos().x <= bounds.x + parent.width / 2 &&
            k.mousePos().y >= bounds.y - parent.height / 2 &&
            k.mousePos().y <= bounds.y + parent.height / 2
        );

        if (!isMouseOverParent) return;

        const scrollSensitivity = 10; 
        let val = 0;

        if (direction === "horizontal") {
            sliderBar.pos.x = k.clamp(sliderBar.pos.x + (delta.y / scrollSensitivity), -limit, limit);
            val = k.map(sliderBar.pos.x, -limit, limit, 0, 1);
        } else {
            sliderBar.pos.y = k.clamp(sliderBar.pos.y + (delta.y / scrollSensitivity), -limit, limit);
            val = k.map(sliderBar.pos.y, -limit, limit, 0, 1);
        }

        if (val < 0.1) val = 0;

        if (type === "musicVolume") {
            gm.settings.musicVolume = val;
        } else if (type === "sfxVolume") {
            gm.settings.sfxVolume = val;
        }

        onChange(val);
    });

    return sliderBar;
}








// NOTE: Some alignment bugs occur on usage with larger containers.
export function makeIcons(Container: any, popupObjects: GameObj[], data: FishObj[] | ShopObj[] | BagObj[], sliderPos: "left" | "right", ICON_COLS = 4, ICON_PADDING = 7, isStore?: boolean ): GameObj[] {

    const ICON_SIZE = 32;
    const POPUP_WIDTH = Container.width;
    const POPUP_HEIGHT = Container.height;
    const TOOLTIP_PADDING = 7;
    const ROW_HEIGHT = ICON_SIZE + ICON_PADDING
    const SLIDER_WIDTH = 4;


    let adjustX = sliderPos === "left" ? SLIDER_WIDTH : 0;

    let iconsList: GameObj[]
    iconsList = []

    data.forEach((obj, idx) => {
        
        const objId = "fishId" in obj ? obj.fishId : ("itemId" in obj ? obj.itemId : idx);     

        const col = idx % ICON_COLS;
        const row = Math.floor(idx / ICON_COLS);

        const startX = (Container.pos.x - POPUP_WIDTH / 2 + ICON_PADDING + ICON_SIZE) - 15 + adjustX;
        const startY = (Container.pos.y - POPUP_HEIGHT / 2 + ICON_PADDING + ICON_SIZE) - 15;

        

        
        let objLocked = obj.sprite
        if ("spriteLocked" in obj) {
            if(gm.fishUnlocked.includes(objId.toString())) {
                objLocked = obj.sprite
                obj.unlocked = true
            } else {
                objLocked = obj.spriteLocked
            }
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
                objId: objId,
                data: obj,
                price: obj.price,
                baseY: 0,
            },
        ]);
        icon.baseY = icon.pos.y;

        // shop price 
        const priceText = icon.add([
            k.text(`${obj.price}$`, { font: "happy", size: 5}),
            k.pos(16,14.2),
            k.anchor("right"),
            k.color(COLORS.ORANGE),
            k.opacity(0),
            k.z(4),
        ])

        const priceTextBox = icon.add([
            k.rect(priceText.width+3, priceText.height+3),
            k.pos(17.4,13.4),
            k.anchor("right"),
            k.color(COLORS.BLACK),
            k.opacity(priceText.opacity),
            k.outline(1, COLORS.ORANGE),
            k.z(3),
        ])

        
        if (!isStore) {
            k.destroy(priceText)
            k.destroy(priceTextBox)
        }

        // stackable items
        let count = 0;
        if ("count" in icon.data) {
            count = icon.data.count
        }

        const amountText = icon.add([
            k.text(`${count}`, { font: "happy", size: 5}),
            k.pos(16,14.2),
            k.anchor("right"),
            k.color(COLORS.ORANGE),
            k.opacity(1),
            k.z(4),
            "amount-text"
        ])

        const amountTextBox = icon.add([
            k.rect(amountText.width+3, amountText.height+3),
            k.pos(17.4,13.4),
            k.anchor("right"),
            k.color(COLORS.BLACK),
            k.opacity(amountText.opacity),
            k.outline(1, COLORS.ORANGE),
            k.z(3),
            "amount-box"
        ])
 
        if (count < 2) {
            k.destroy(amountText)
            k.destroy(amountTextBox)
        }


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
            if (icon.opacity === 0) return;
            playSound("icon-sound-1", "sfx", -0.8)
            tooltip.opacity = 1;
            tooltipText.opacity = 1;
        });

        icon.onClick(() => {
            if (icon.opacity === 0) return;
            // TODO add a shaking animation?
            playSound("icon-sound-1", "sfx", -0.7)
            tooltipText.opacity = 1;
        });

        icon.onHoverEnd(() => {
            tooltip.opacity = 0;
            tooltipText.opacity = 0;
        });
        
        icon.onUpdate(() => {
            if (icon.isHovering()) {
                if (!obj.unlocked && 'activeTime' in obj) {
                        tooltipText.text = `???\n${obj.activeTime}`;
                        tooltipText.width = 0;
                } else {
                        tooltipText.text = `${obj.name}\n\n${obj.desc}`;
                        if (obj.feature === "Rod Unique") {
                            const rodData = ROD_DATA.find(f => obj.name === f.name) as RodObj;
                            if (rodData === undefined) throw new Error("Rod tooltip text creation failed. Rod data not found")
                            let rodbonus = (Number(rodData.rodId) | 0)/8
                            //final rod
                            if (rodbonus >= 0.7) rodbonus += 2
                            tooltipText.text = `${obj.name}\n\n${obj.desc}\n
                            Reeling speed: ${rodData.reelSpeed}
                            Catch area: ${rodData.catchArea}
                            Line durability: ${rodData.endurance}
                            Luck bonus: ${rodbonus}
                            `
                        }

                        tooltipText.text = tooltipText.text.trim().split("\n").map((line) => line.trimStart()).join("\n");

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


                //flip logic
                if (icon.pos.x + tooltip.width  + 10 > k.width()) {
                    tooltip.pos.x = icon.pos.x - (icon.width / 2) - (tooltip.width / 2 + 2)
                    tooltipText.pos.x = tooltip.pos.x
                }
                if (icon.pos.y + tooltip.height  + 5 > k.height()) {
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
                    priceText.opacity = 0;
                    priceTextBox.opacity = 0;
                    amountText.opacity = 0;
                    amountTextBox.opacity = 0;

                } else {
                    icon.opacity = 1;
                    priceText.opacity = 1;
                    priceTextBox.opacity = 1;
                    amountText.opacity = 1;
                    amountTextBox.opacity = 1;
                }

                icon.onDestroy(() => {
                    tooltip.destroy()
                    tooltipText.destroy()
                })
        });

        popupObjects.push(icon,tooltip,tooltipText)
        iconsList.push(icon)
    });

    // 
    // SCROLLING LOGIC AND SLIDER COMPONENT
    //   

    let sliderHeight = Container.height

    const totalRows = Math.ceil(data.length / ICON_COLS);
    const contentHeight = totalRows * ROW_HEIGHT;
    const visibleRows = Math.floor(POPUP_HEIGHT / ROW_HEIGHT);
    const visibleHeight = visibleRows * ROW_HEIGHT;
    const maxScroll = Math.max(0, contentHeight - visibleHeight);


    if (contentHeight > sliderHeight) {
        let ratio = Container.height / contentHeight
        sliderHeight = Container.height * ratio
    }
    if (sliderHeight < 5) sliderHeight = 5;


    let sliderContainer = makeContainer("center", COLORS.DARKBLUE, 
        SLIDER_WIDTH, Container.height, 0.5, Container)
    alignObj(sliderContainer, Container, 0, 0, 0, `${sliderPos}`)
    
    let slider = makeContainer("center", COLORS.BEIGE, 
        SLIDER_WIDTH, sliderHeight, 0.5, Container)
    alignObj(slider, Container, 0, 0, 0, `top${sliderPos}`)

    const sliderRange = Container.height - slider.height;
    const startY = -Container.height / 2 + slider.height / 2;
    const endY = Container.height / 2 - slider.height / 2;
    const sliderStep = (ROW_HEIGHT / maxScroll) * sliderRange;

    k.onScroll((delta) => {
        if (!Container.isHovering() || maxScroll <= 0) return;
        
        const direction = Math.sign(delta.y);
        slider.pos.y = k.clamp(slider.pos.y + (direction * sliderStep), startY, endY);
        
        const currentPercent = (slider.pos.y - startY) / sliderRange;
        const currentScrollY = Math.round((currentPercent * maxScroll) / ROW_HEIGHT) * ROW_HEIGHT;
        iconsList.forEach(icon => {
            icon.pos.y = icon.baseY - currentScrollY;
        });
    });

    sliderContainer.onClick(() => {
        if (!sliderContainer.isHovering() || maxScroll <= 0) return;
        const localMousePos = k.mousePos().y - sliderContainer.worldPos().y;
        slider.pos.y = k.clamp(localMousePos, startY, endY);
        const currentPercent = (slider.pos.y - startY) / sliderRange;
        const currentScrollY = Math.round((currentPercent * maxScroll) / ROW_HEIGHT) * ROW_HEIGHT;

        iconsList.forEach(icon => {
            icon.pos.y = icon.baseY - currentScrollY;
        });
    })

    return iconsList;

}




//Don't include .onHover or .onClick in these.

export function hoverProcess(obj: GameObj) {
    playSound("icon-sound-2", "sfx", -0.5)
        const originalColor = obj.color
        obj.color = COLORS.YELLOW;
        obj.onHoverEnd(() => {
        obj.color = originalColor;
    });
}

export function clickProcess(obj: GameObj) {
    playSound("fishing-thunk", "sfx", -0.5)
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
