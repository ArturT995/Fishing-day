import k from "../kaplayCtx";
import { addSprite } from "../assetLoader";
import { COLORS, fontConfig } from "../constants";
import { FISH_DATA } from "../db";
import gm from "../gm";
import { alignObj, bubbleText, clickProcess, hoverProcess, makeButton, makeContainer, makeIcons, makeSlider } from "../ui";
import { musicSet, playSound, sfxSet } from "../sounds";


//change font again


//spamclicking sometimes causes a bug, sounds get overlapped and theres a crackling sound

//add tags and group things



export function menu() {
    k.scene("main-menu", () => {
        k.setCursor("default");//make custom cursor
        
        let background = gm.nightTime ? "nightMenuScreen" : "dayMenuScreen";
        addSprite(background)

        let chosenColor = (background === "nightMenuScreen") ? COLORS.BLUE : COLORS.BEIGE;
        const bgMusic = (background === "nightMenuScreen") ? playSound("night-menu-1", "music", 0, true, 0, 0.8) : playSound("menu-bg-1", "music", 0, true, 0, 1);
        
        

        // change all music/sfx logic, make helper functions, some gm stuff
        // unlocked music/sfx saves.

        //credits song? playSound("menu-bg-1","music", 1, true, 6, 3);



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
            k.color(chosenColor),
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
            k.color(chosenColor),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(2),
        ]);

        const settings = k.add([
            k.text("Settings", fontConfig),
            k.anchor("center"),
            k.pos(k.center().x, k.center().y + 55),
            k.color(chosenColor),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(2),
        ]);


        start.onClick( async () => {
            if (gm.logPopupOpen) return;
            clickProcess(start)
            await k.wait(0.2)
            k.go("day") //change this later to be time based and pull from gamestate
        });
        start.onHover(() => {
            if (gm.logPopupOpen) return;
            hoverProcess(start)
        })


        settings.onClick(() => {
            if (gm.logPopupOpen) return;
            clickProcess(settings);
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

export function openCollectionLog() {
    if (gm.logPopupOpen) return;
    gm.logPopupOpen = true;
    
    const ICON_COLS = 4;
    const POPUP_WIDTH = k.width() / 1.3;
    const POPUP_HEIGHT = k.height() / 1.4;

    const blocker = makeContainer("center", COLORS.BLACK,
    k.width(), k.height(), 0.5)

    const border = makeContainer("center", COLORS.BLACK,
    POPUP_WIDTH+4, POPUP_HEIGHT+4, 1)

    const logContainer = makeContainer("center", COLORS.BROWN,
    POPUP_WIDTH, POPUP_HEIGHT, 1)

    
    const closeBtn = makeButton("Close", 8, COLORS.ORANGE, logContainer, "static")
    alignObj(closeBtn, logContainer, 5, -2, 3, "botright")
    

    let popupObjects = [blocker, logContainer, closeBtn, border]

    //fish icons
    makeIcons(logContainer, popupObjects, FISH_DATA, "right", ICON_COLS)

    closeBtn.onClick(() => {
        popupObjects.forEach(obj => obj.destroy());
        gm.logPopupOpen = false;
    });
};






//alignObj broke hover properties on this when "shop" button was clicked in that scene so
//adjusting things manually here, makeSlider has some issues too, but circumvented them.
export function openSettings() {
    if (gm.logPopupOpen) return;
    gm.logPopupOpen = true;

    const POPUP_WIDTH = k.width() / 1.4;
    const POPUP_HEIGHT = k.height() / 2;
    const PADDING = 8;
    const ROW_HEIGHT = 18;

    const blocker = makeContainer("center", COLORS.BLACK, k.width(), k.height(), 0.5)
    const border = makeContainer("center", COLORS.BLACK, POPUP_WIDTH+4, POPUP_HEIGHT+4, 1)
    const settingsMenu = makeContainer("center", COLORS.BROWN, POPUP_WIDTH, POPUP_HEIGHT, 1)

    
    let musicVolumeContainer = makeContainer("center", COLORS.DARKRED, 
            settingsMenu.width/2, 10, 1, settingsMenu)
    musicVolumeContainer.pos = k.vec2(
        -settingsMenu.width / 2 + (musicVolumeContainer.width / 2) + PADDING, 
        -settingsMenu.height / 2 + 15
    );

    const volumeText = settingsMenu.add([
        k.text("MUSIC VOLUME", fontConfig),
        k.color(COLORS.ORANGE),
        k.anchor("right"),
        k.pos(settingsMenu.width / 2 - PADDING, -settingsMenu.height / 2 + 16),
        k.area(),
    ]);
    
    const volumeSlider = makeSlider(COLORS.ORANGE, musicVolumeContainer, "horizontal", "musicVolume", (val) => {
        musicSet.forEach((offset, song) => {
            song.volume = val + offset;
        });
    });


    let sfxVolumeContainer = makeContainer("center", COLORS.DARKRED, 
            settingsMenu.width/2, 10, 1, settingsMenu)
    sfxVolumeContainer.pos = k.vec2(
        -settingsMenu.width / 2 + (sfxVolumeContainer.width / 2) + PADDING, 
        -settingsMenu.height / 2 + 15 + ROW_HEIGHT
    );

    const sfxText = settingsMenu.add([
        k.text("SFX VOLUME", fontConfig),
        k.color(COLORS.ORANGE),
        k.anchor("right"),
        k.pos(settingsMenu.width / 2 - PADDING,-settingsMenu.height / 2 + 16 + ROW_HEIGHT),
        k.area(),
    ]);
    
    const sfxSlider = makeSlider(COLORS.ORANGE, sfxVolumeContainer,"horizontal", "sfxVolume", (val) =>  {
        sfxSet.forEach((offset, sfx) => {
            sfx.volume = val + offset;
        });
    });


    const closeBtn = settingsMenu.add ([
        k.text("Close", fontConfig),
        k.pos(0, POPUP_HEIGHT / 2 - PADDING),
        k.anchor("center"),
        k.color(COLORS.ORANGE),
        k.area(),
        k.z(4)
    ]);

    closeBtn.onHover(() => {
        hoverProcess(closeBtn)
    });
    closeBtn.onClick(async () => {
        settingsMenu.destroy();
        blocker.destroy();
        border.destroy();
        await k.wait(0.1)
        gm.logPopupOpen = false
    });
}
