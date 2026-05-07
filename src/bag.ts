import { COLORS } from "./constants";
import { ITEM_DATA, type BagObj, type ShopObj } from "./db";
import gm from "./gm";
import k from "./kaplayCtx";
import { alignObj, makeButton, makeContainer, makeIcons } from "./ui";



export function openBag() {
    if (gm.logPopupOpen) return;
    gm.logPopupOpen = true;
    
    const ownedItems = getStackableItems()
    k.debug.log(ownedItems[9].count)

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
                icon.onClick(() => {
                    if (gm.logpopupOpen === false) return;
                    if (icon.opacity === 0) return;

                    const id = icon.objId.toString();
                    const name = icon.data.name;
                    if (icon.color !== COLORS.GREEN) {
                        icon.color = COLORS.GREEN;
                    } else {
                        icon.color = COLORS.WHITE;
                    }

                    if (icon.data.name === "Beer") {
                        k.play("drinking-noise", {detune: k.randi(-500, 500)})
                    }

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