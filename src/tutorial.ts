import k from "./kaplayCtx";
import { COLORS, fontConfig } from "./constants";
import { playSound } from "./sounds";
import { clickProcess, hoverProcess, makeContainer, makeButton} from "./ui";
import gm from "./gm";



export function tutorialPopup() {
    gm.logPopupOpen = true

    const POPUP_WIDTH = k.width() / 1.3;
    const POPUP_HEIGHT = k.height() / 1.4;
    let PADDING = 10;

    const blocker = makeContainer("center", COLORS.BLACK,
    k.width(), k.height(), 0.5)

    const border = makeContainer("center", COLORS.BLACK,
    POPUP_WIDTH+4, POPUP_HEIGHT+4, 1)

    const container = makeContainer("center", COLORS.BROWN,
    POPUP_WIDTH, POPUP_HEIGHT, 1)

    const closeBtn = makeButton("Close", 8, COLORS.ORANGE, container, "static", PADDING*1.5, PADDING/2)
    closeBtn.onClick(() => {
                popupObjects.forEach(obj => obj.destroy())
                gm.logPopupOpen = false
            })

    
    makeButton("How to play", 8, COLORS.ORANGE, container, "static", POPUP_WIDTH/3.5 - 6, POPUP_HEIGHT-PADDING, false)
    makeButton(
        `

        Catch fish and sell them
        in the store for rods and items.

        3 new fish show up every minute

        When a Fish Feed is used
        fish fill up the lake until
        they reach the limit

        You can hunt rarer fish by cycling
        through fish spawns with Fish Feed
        and Rancid Gloop

        `, 6, COLORS.ORANGE, container, "static", POPUP_WIDTH/3.5 - 2, POPUP_HEIGHT-PADDING*6, false)
    
    makeButton("Controls", 8, COLORS.ORANGE, container, "static", POPUP_WIDTH/1.25, POPUP_HEIGHT-PADDING, false)
    makeButton(
        `
        lmb - power up and throw fishing reel
        rmb - hold to reel bobber back
        S - enable fish silhouette mode
        D - enable fish color mode(default)
        
        Item hotkeys
        1 - toggle fish identifier
        2 - Use Rancid Gloop
        3 - Use Fish Feed Can
        4 - Use Fish Feed Deluxe
        5 - Use Deluxe Bait

        `, 6, COLORS.ORANGE, container, "static", POPUP_WIDTH/1.25 - 5, POPUP_HEIGHT-PADDING*6, false)


    
    let popupObjects = [blocker, container, closeBtn, border]
}