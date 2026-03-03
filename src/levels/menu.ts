import { addSprite } from "../assetLoader";
import { COLORS, fontConfig, fontConfigSmall } from "../constants";
import { FISH_DATA } from "../entities/fishes";
import gm from "../gm";
import k from "../kaplayCtx";
import { bubbleText, clickProcess, hoverProcess } from "../utils";



//do basic settings
//add current datetime around the logo in the empty spots
//and see if it makes sense
//if not add it elsewhere

export function menu() {
    k.scene("main-menu", () => {
        k.setCursor("default");
        addSprite("bg1")
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


        start.onClick(() => {
            if (gm.logPopupOpen) return;
            clickProcess(start)
            k.go("morning") //change this later to be time based and pull from gamestate
        });
        start.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(start)
        })


        settings.onClick(() => {
            if (gm.logPopupOpen) return;
            clickProcess(settings)
            //popup box with some settings, look at golf game to figure that out easier
        });
        settings.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(settings)
        })
    

        log.onClick(() => {
            if (gm.logPopupOpen) return;
            openCollectionLog()
            gm.logPopupOpen = true;
            clickProcess(log)
        });
        log.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(log)
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
    const POPUP_WIDTH = k.width() / 1.4;
    const POPUP_HEIGHT = k.height() / 1.5;

    const popup = k.add([
        k.rect(POPUP_WIDTH, POPUP_HEIGHT),//replace with sprite
        k.pos(k.width() / 2, k.height() / 2.2),
        k.anchor("center"),
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
        k.rect(100, 40), //change to dynamic
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.opacity(0.9),
        k.z(5),
    ]);

    const tooltipText = k.add([
        k.text("", fontConfigSmall),
        k.pos(0, 0),
        k.color(COLORS.BEIGE),
        k.z(5),
    ]);

    tooltip.hidden = true;
    tooltipText.hidden = true;

    const popupObjects = [popup, closeBtn, tooltip, tooltipText];

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
                tooltipText.text = `${fish.name}\n${fish.desc}`;
            }
            tooltip.hidden = false;
            tooltipText.hidden = false;
        });

        icon.onUpdate(() => {
            if (!tooltip.hidden) {
                tooltip.pos = k.mousePos().add(15, 15);
                tooltipText.pos = tooltip.pos.add(5, 5)
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
    //this will have adjustable settings that will be stored in gamestate and do not reset.
}