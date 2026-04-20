import k from "../kaplayCtx";
import { addSprite } from "../assetLoader";
import { COLORS, fontConfig } from "../constants";
import { FISH_DATA } from "../db";
import gm from "../gm";
import { alignObj, bubbleText, clickProcess, hoverProcess, makeButton, makeContainer, makeIcons, makeSlider } from "../ui";


//change font again


//spamclicking sometimes causes a bug, sounds get overlapped and theres a crackling sound

//add tags and group things



export function menu() {
    k.scene("main-menu", () => {
        k.setCursor("default");//make custom cursor
        addSprite("titlebox", k.z(1))
        addSprite("menu-bg")

        // change all music/sfx logic, make helper functions, some gm stuff
        // unlocked music/sfx saves.
        const bgMusic = k.play("menu-bg-1", {volume: 0.4, loop: true});
    



    /*
    Move these to Stats when you make it.

    const totalCaught = gm.fishCaught.length;
    const totalUnlocked = gm.fishUnlocked.length;

    k.add([
        k.text(`Fish Discovered: ${totalUnlocked}`, {font: "happy", size: 6}),
        k.pos(20, 20),
        k.z(23),
    ]);
    k.add([
        k.text(`Fish Caught: ${totalCaught}`, {font: "happy", size: 6}),
        k.pos(20, 40),
        k.z(23),
    ]);
    */
    //const menuContainer = makeContainer()
    
    //const start = makeButton()
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
    gm.logPopupOpen = true;
    
    const ICON_COLS = 4;
    const ICON_SIZE = 32;
    const ICON_PADDING = 7;
    const POPUP_WIDTH = k.width() / 1.3;
    const POPUP_HEIGHT = k.height() / 1.4;
    const TOOLTIP_PADDING = 7;
    const ICON_VAL = 0; // for scrolling value changes

    const blocker = makeContainer("center", COLORS.BLACK,
    k.width(), k.height(), 0.5)

    const border = makeContainer("center", COLORS.BLACK,
    POPUP_WIDTH+4, POPUP_HEIGHT+4, 1)

    const logContainer = makeContainer("center", COLORS.BROWN,
    POPUP_WIDTH, POPUP_HEIGHT, 1)

    const logSliderContainer = makeContainer("center", COLORS.BEIGE,
    5, POPUP_HEIGHT, 0.5, logContainer)
    alignObj(logSliderContainer, logContainer, 0, 0, 0, "right")

    const logSlider = makeSlider(COLORS.BEIGE, logSliderContainer, "vertical" , "scroll", (val) => {k.setVolume(val)}) // placeholder value

    const closeBtn = makeButton("Close", 8, COLORS.BEIGE, logContainer, "static")
    alignObj(closeBtn, logContainer, 5, -2, 3, "botright")
    

    let popupObjects = [blocker, logContainer, closeBtn, border, logSlider]

    

    const iconContainer = k.add([
        k.rect(POPUP_WIDTH, POPUP_HEIGHT),
        k.pos(k.center()),
        k.color(33, 33, 33),
        k.opacity(1),
        k.mask(),
        k.area(),
        k.z(1)
    ]);

    let icons = makeIcons(iconContainer, popupObjects, FISH_DATA)

    closeBtn.onClick(() => {
        popupObjects.forEach(obj => obj.destroy());
        gm.logPopupOpen = false;
    });
};









function openSettings() {
    
    const POPUP_WIDTH = k.width() / 1.4;
    const POPUP_HEIGHT = k.height() / 2;
    const PADDING = 8;

    const blocker = makeContainer("center", COLORS.BLACK, k.width(), k.height(), 0.5)
    const settingsMenu = makeContainer("center", COLORS.BLUE, POPUP_WIDTH, POPUP_HEIGHT, 1)
    
    let volumeContainer = makeContainer("left", COLORS.BEIGE, 
            settingsMenu.width/2, 10, 1, settingsMenu)
    alignObj(volumeContainer, settingsMenu, 0, 0, 10, "topleft")
    let volumeText = makeButton("VOLUME", 8, COLORS.BEIGE, settingsMenu,"static")
    alignObj(volumeText, settingsMenu, 0, 2, 10, "topright")
    const volumeSlider = makeSlider(COLORS.RED, volumeContainer,"horizontal", "volume", (val) => {k.setVolume(val)});


    volumeSlider.onUpdate(() => {
        let newVolume = k.getVolume()
        gm.settings.musicVolume = newVolume;
        gm.saveProgress();
    });

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