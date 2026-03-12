import k from "../kaplayCtx";
import { addSprite } from "../assetLoader";
import { COLORS, fontConfig } from "../constants";
import { FISH_DATA } from "../entities/fishes";
import gm from "../gm";
import { bubbleText, clickProcess, hoverProcess } from "../utils";
import type { GameObj } from "kaplay";




//add current datetime around the logo in the empty spots
//and see if it makes sense
//if not add it elsewhere

//redo menu sprite, put logo on seperate layer and polish bg
//add tags and group things

export function menu() {
    k.scene("main-menu", () => {
        k.setCursor("default");
        addSprite("titlebox", k.z(1))
        addSprite("menu-bg")
        const bgMusic = k.play("bg-music", {volume: 0.4, loop: true});

        const start = k.add([
            k.text("Click to start", {font: "happy", size: 12}),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 25),
            k.color(COLORS.BEIGE),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(2),
        ]);
        bubbleText(start)

        const log = k.add([
            k.text("Collection Log", fontConfig),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 70),
            k.color(COLORS.BEIGE),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(2),
        ]);

        const settings = k.add([
            k.text("Settings", fontConfig),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 55),
            k.color(COLORS.BEIGE),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(2),
        ]);


        start.onClick( async () => {
            if (gm.logPopupOpen) return;
            clickProcess(start)
            await k.wait(0.1)
            k.go("day") //change this later to be time based and pull from gamestate
        });
        start.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(start)
        })


        settings.onClick(() => {
            if (gm.logPopupOpen) return;
            clickProcess(settings);
            gm.logPopupOpen = true;
            openSettings();
        });
        settings.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(settings);
        })
    

        log.onClick(() => {
            if (gm.logPopupOpen) return;
            openCollectionLog();
            gm.logPopupOpen = true;
            clickProcess(log);
        });
        log.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(log);
        })
        
        
        k.onSceneLeave(() => {
            bgMusic.stop();
        });
    });
};










// Log and settings functions


function openCollectionLog() {
    const COLS = 4;
    const ICON_SIZE = 32;
    const PADDING = 7;
    const TOOLTIP_PADDING = 5;
    const POPUP_WIDTH = k.width() / 1.4;
    const POPUP_HEIGHT = k.height() / 1.5;

    //refactor to make popup parent with relative offshoots
    const popup = k.add([
        k.rect(POPUP_WIDTH, POPUP_HEIGHT),//replace or wrap in with sprite
        k.pos(k.width() / 2, k.height() / 2.2),
        k.anchor("center"),
        k.outline(2),
        k.color(COLORS.BLUE),
        k.area(),
        k.z(3),
    ]);

    const closeBtn = k.add ([
        k.text("Close", fontConfig),
        k.pos(popup.pos.x, popup.pos.y * 1.6),
        k.anchor("center"),
        k.color(COLORS.BEIGE),
        k.area(),
        k.z(4)
    ]);
   
    const tooltip = k.add([
        k.rect(0, 0),
        k.pos(0, 0),
        k.color(COLORS.DARKBLUE),
        k.outline(1),
        k.z(5),
    ]);
    
    const tooltipText = k.add([
        k.text("", {font: "happy", size: 6, width: 120}),
        k.pos(0, 0),
        k.color(COLORS.BEIGE),
        k.z(5),
    ]);

    //reuse in settings
    const blocker = k.add([
        k.rect(k.width(),k.height()),
        k.anchor("center"),
        k.color(0,0,0),
        k.pos(k.center()),
        k.opacity(0.5),
        k.z(2)
    ])

    tooltip.hidden = true;
    tooltipText.hidden = true;

    const popupObjects = [blocker, popup, closeBtn, tooltip, tooltipText];

    FISH_DATA.forEach((fish, id) => {
        const col = id % COLS;
        const row = Math.floor(id / COLS);

        const startX = (popup.pos.x - POPUP_WIDTH / 2 + PADDING + ICON_SIZE) - 15;
        const startY = (popup.pos.y - POPUP_HEIGHT / 2 + PADDING + ICON_SIZE) - 15;

        const icon = k.add([
            k.sprite(fish.sprite),
            k.pos(startX + col * (ICON_SIZE + PADDING), startY + row * (ICON_SIZE + PADDING)),
            k.anchor("center"),
            k.area(),
            k.z(4),
            k.opacity(fish.unlocked ? 1 : 0.3),
            k.color(fish.unlocked ? k.rgb(255, 255, 255) : k.rgb(50, 50, 50)),
            {
                fishData: fish,
            },
        ]);

        icon.onHover(() => {
            k.play("icon",{volume: 0.3})
            if (!fish.unlocked) {
                tooltipText.text = "???";
            } else {
                tooltipText.text = `${fish.name}\n${fish.desc}${fish.desc}${fish.desc}${fish.desc}${fish.desc}${fish.desc} awa`;
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
            tooltip.hidden = false;
            tooltipText.hidden = false;
        });

        icon.onUpdate(() => {
            if (tooltip.hidden) return;
            const mouse = k.mousePos();
            tooltip.pos = mouse.add(5, 5);
            tooltipText.pos = tooltip.pos.add(TOOLTIP_PADDING / 2, TOOLTIP_PADDING / 2)
            //toggle tooltip position
            if (mouse.x + tooltip.width > k.width()) {
                const flipX = -tooltip.width - (TOOLTIP_PADDING / 2);
                tooltipText.pos = tooltip.pos.add(flipX, TOOLTIP_PADDING / 2);
                tooltip.pos = mouse.add(flipX, 5);
            }
        });

        icon.onHoverEnd(() => {
            tooltip.hidden = true;
            tooltipText.hidden = true;
        });

        popupObjects.push(icon);
    });

    closeBtn.onHover(() => {
        hoverProcess(closeBtn)
    });
    closeBtn.onClick(() => {
        clickProcess(closeBtn)
        popupObjects.forEach(obj => obj.destroy());
        gm.logPopupOpen = false;
    });
}







function openSettings() {
    
    const POPUP_WIDTH = k.width() / 1.4;
    const POPUP_HEIGHT = k.height() / 2;
    const PADDING = 8;

    const blocker = k.add([
        k.rect(k.width(),k.height()),
        k.anchor("center"),
        k.color(0,0,0),
        k.area(),
        k.pos(k.center()),
        k.opacity(0.5),
        k.z(2),
    ])

    const settingsMenu = k.add([
        k.rect(POPUP_WIDTH, POPUP_HEIGHT),//replace or wrap in with sprite
        k.pos(k.center()),
        k.anchor("center"),
        k.color(COLORS.BLUE),
        k.area(),
        k.z(3),
    ]);

    makeSlider(
        settingsMenu, 
        "Volume", 
        -POPUP_HEIGHT / 2 + PADDING + 2,
        1, 
        (val) => {k.setVolume(val)}
    );

    const closeBtn = settingsMenu.add ([
        k.text("Close", fontConfig),
        k.pos(0, POPUP_HEIGHT / 2 - PADDING),
        k.anchor("center"),
        k.color(COLORS.BEIGE),
        k.area(),
        k.z(4)
    ]);

    closeBtn.onHover(() => {
        hoverProcess(closeBtn)
    });
    closeBtn.onClick(() => {
        clickProcess(closeBtn)
        gm.logPopupOpen = false;
        settingsMenu.destroy();
        blocker.destroy();
    });
}







function makeSlider(parent: GameObj, label: string, yOffset: number, initial: number, onChange: (val: number) => void) {
    const SLIDER_WIDTH = parent.width / 2;
    const CONTROLLER_SIZE = 4;
    const LABEL_GAP = 10;
    
    const labelInfo = k.formatText({
        text: label,
        ...fontConfig,
    });

    const totalWidth = labelInfo.width + LABEL_GAP + SLIDER_WIDTH;
    const startX = -totalWidth / 2;

    parent.add([
        k.text(label, fontConfig),
        k.anchor("left"),
        k.color(COLORS.BEIGE),
        k.pos(startX, yOffset),
        k.z(4),
    ]);

    const track = parent.add([
        k.rect(SLIDER_WIDTH, CONTROLLER_SIZE*2),
        k.anchor("left"),
        k.pos(startX + labelInfo.width + LABEL_GAP, yOffset),
        k.color(COLORS.BEIGE),
        k.area(),
        k.z(4),
    ]);

    const controller = parent.add([
        k.rect(CONTROLLER_SIZE,CONTROLLER_SIZE*2),
        k.anchor("center"),
        k.pos(track.pos.x + initial * SLIDER_WIDTH, yOffset),
        k.color(COLORS.YELLOW),
        k.area(),
        k.z(5),
    ]);

    let dragging = false;

    const trackLeft: number = parent.pos.x + track.pos.x;
    const trackRight = trackLeft + SLIDER_WIDTH;
    let mouseX = k.mousePos().x;
    let clamped = k.clamp(mouseX, trackLeft, trackRight);
    let value = (clamped - trackLeft) / SLIDER_WIDTH;

    controller.onUpdate(() => {
        if (k.isMousePressed("left") && track.isHovering()) {
            dragging = true;
        }
        if (k.isMouseReleased("left")) {
            dragging = false;
        }
        if (dragging) {
            mouseX = k.mousePos().x;
            clamped = k.clamp(mouseX, trackLeft, trackRight);
            controller.pos.x = clamped - parent.pos.x;
            value = (clamped - trackLeft) / SLIDER_WIDTH;
            onChange(value);
        }});

    return controller;
}