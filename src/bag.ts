import type { GameObj } from "kaplay";
import { COLORS } from "./constants";
import { ITEM_DATA, ROD_DATA, type BagObj, type RodObj, type ShopObj } from "./db";
import gm from "./gm";
import k from "./kaplayCtx";
import { playSound } from "./sounds";
import { alignObj, makeButton, makeContainer, makeIcons } from "./ui";



export function openBag() {
    if (gm.logPopupOpen) return;
    gm.logPopupOpen = true;
    
    const ownedItems = getStackableItems()

    //squish multiple items and add an item counter
    
    const ICON_COLS = 4;
    const POPUP_WIDTH = k.width() / 1.3;
    const POPUP_HEIGHT = k.height() / 1.4;

    const blocker = makeContainer("center", COLORS.BLACK,
    k.width(), k.height(), 0.5)

    const border = makeContainer("center", COLORS.BLACK,
    POPUP_WIDTH+4, POPUP_HEIGHT+4, 1)

    const bagContainer = makeContainer("center", COLORS.BROWN,
    POPUP_WIDTH, POPUP_HEIGHT, 1)

    

    const closeBtn = makeButton("Close", 8, COLORS.ORANGE, bagContainer, "static")
    alignObj(closeBtn, bagContainer, 5, -2, 3, "botright")
    

    let popupObjects = [blocker, bagContainer, closeBtn, border]

    const bagIcons = makeIcons(bagContainer, popupObjects, ownedItems, "right", ICON_COLS)


    for (let icon of bagIcons) {
                icon.onClick(async () => {
                    if (icon.opacity === 0) return;

                    const id = icon.objId.toString();
                    const name = icon.data.name;

                    if (!icon.data.feature.includes("Unique")) {
                        gm.removeItem(id)
                        icon.data.count -= 1;
                        if (icon.data.count > 0) {
                            const txt = icon.get("amount-text")[0]; 
                            if (txt) txt.text = icon.data.count.toString();
                        } else {
                            icon.destroy()
                        }

                    }

                    // rods
                    // BUG: there might be another drift issue with rods after i clicked sell all
                    // or switched rods, scenes.
                    const selectedRod = ROD_DATA.find(rod => rod.name === name);

                    if (selectedRod) {
                        equipRod(selectedRod, icon);
                        // ADD storage save for equipped rod.
                    }


                    // item effects


                    // alcohols
                    if (name === "Beer") {
                        // ADD TOAST "you drink a beer"
                        playSound("drinking-noise", "sfx", 0, false, k.randi(-500, -200));
                        gm.intoxication += 1;
                    }
                    if (gm.intoxication > 13) {
                        // ADD TOAST "you feel sick"
                        gm.intoxication = 0;
                        await k.wait(1)
                        // ADD TOAST "you puke"
                        playSound("chomps", "sfx", 0, false, k.randi(-2500, -2400), 2);
                    }

                    // pipe, cards, dice, food
                    if (name === "Fried Fish") {
                        // ADD TOAST "You consume the fried fish."
                        playSound("chomps", "sfx");
                    }
                    if (name === "Cards") {
                        if (!gm.logPopupOpen) return;
                        // ADD TOAST "You shuffle the cards for fun."
                        playSound("cards", "sfx");
                    }
                    if (name === "Dice") {
                        // ADD TOAST "You roll the dice... you rolled: ${k.randi(2,12)}"
                        playSound("dice-roll", "sfx");
                        await k.wait(1)

                        // ADD TOAST "...you rolled: ${k.randi(2,12)}"
                        // ADD custom sounds to 2 and 12 and extra toast.

                    }
                    if (icon.data.name === "Pipe") {
                        // ADD TOAST "You consume the fried fish."
                        playSound("pipe", "sfx");
                    }


                })
            }



    closeBtn.onClick(() => {
        popupObjects.forEach(obj => obj.destroy());
        gm.logPopupOpen = false;
    });
}



function getStackableItems(): BagObj[] {
    const counts: Record<string, number> = {};

    gm.itemsOwned.forEach(id => {
        counts[id] = (counts[id] || 0) + 1;
    });

    const items = Object.entries(counts).map(([id, count]) => {
        const data = ITEM_DATA.find(item => item.itemId.toString() === id);
        return { ...data, count } as BagObj;
    }).filter(item => item.itemId !== undefined);

    return items.sort((a, b) => {
        if (a.feature === "Rod Unique" && b.feature !== "Rod Unique") return -1;
        if (a.feature !== "Rod Unique" && b.feature === "Rod Unique") return 1;

        if (a.feature !== "Night Unique" && b.feature === "Night Unique") return -1;
        if (a.feature === "Night Unique" && b.feature !== "Night Unique") return 1;

        if (a.price > b.price ) return -1;
        if (a.price < b.price) return 1;
        
        return a.name.localeCompare(b.name);
    });
}




function equipRod(rod: RodObj, currentIcon: GameObj) {
    ROD_DATA.forEach(r => r.selected = false);
    rod.selected = true;
    if (gm.currentRodIcon) {
        gm.currentRodIcon.color = COLORS.WHITE;
    }


    gm.reelSpeed = rod.reelSpeed;
    gm.catchArea = rod.catchArea;
    gm.endurance = rod.endurance;

    currentIcon.color = COLORS.LIGHTGREEN

    gm.currentRodIcon = currentIcon;
}