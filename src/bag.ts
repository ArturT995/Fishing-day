import type { GameObj } from "kaplay";
import { COLORS, fontConfig } from "./constants";
import { ITEM_DATA, ROD_DATA, type BagObj, type RodObj} from "./db";
import gm from "./gm";
import k from "./kaplayCtx";
import { playSound } from "./sounds";
import { clickProcess, hoverProcess, makeContainer, makeIcons } from "./ui";
import { message } from "./messages";
import { generateFishes } from "./entities/fishes";



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

    

    const closeBtn = bagContainer.add ([
        k.text("Close", fontConfig),
        k.pos(POPUP_WIDTH / 2 - 15, POPUP_HEIGHT / 2 - 5),
        k.anchor("center"),
        k.color(COLORS.ORANGE),
        k.area(),
        k.z(4)
    ]);
    

    let popupObjects = [blocker, bagContainer, closeBtn, border]

    const bagIcons = makeIcons(bagContainer, popupObjects, ownedItems, "right", ICON_COLS)


    for (let icon of bagIcons) {
            
        const isRod = icon.data.feature.includes("Rod Unique");

        if (isRod) {
            const name = icon.data.name;
            const currentObj = ROD_DATA.find(rod => rod.name === name);
            const currentId = currentObj?.rodId?.toString();
            const equippedId = gm.equippedRodId;
            if (currentId === equippedId) {
                icon.color = COLORS.LIGHTGREEN;
                gm.currentRodIcon = icon;
            }
        }

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
            const selectedRod = ROD_DATA.find(rod => rod.name === name);
            if (selectedRod) {
                equipRod(selectedRod, icon);
            }


            // item effects
            if (name === "Fish Feed Can") {
                message("You scatter the contents into the lake.")
                splashSounds()
                generateFishes()
            }
            if (name === "Fish Feed Deluxe") {
                message("The Fish go wild.")
                thunkSounds()
                splashSounds()
                let fishes = k.get("fish");
                fishes.forEach(fish => fish.destroy())
                let fishNames = k.get("fishName");
                fishNames.forEach(name => name.destroy())
                generateFishes()
                generateFishes() // TODO: add a generateRarerFishes instead
                await k.wait(0.5)
                thunkSounds()
            }
            if (name === "Rancid gloop") {
                message("Disgusting.")
                let fishes = k.get("fish");
                let fishNames = k.get("fishName");
                playSound("rancid-gloop", "sfx")
                splashSounds()
                fishes.forEach(fish => fish.destroy())
                fishNames.forEach(name => name.destroy())
            }
            if (name === "Deluxe Bait") {
                message("You apply some of that fancy bait.")
                playSound("powerup", "sfx",0, false, -500)
                gm.baitPower += 5;
            }
            if (name === "Fish identifier") {
                if (gm.identifierOn) {
                    message("You turn on the identifier off.")
                    playSound("fishing-thunk", "sfx", 0, false, 1000);
                    await k.wait(0.1)
                    playSound("fishing-thunk", "sfx", 0, false, 500);
                    await k.wait(2)
                    message("It feels like a relief.")
                    gm.identifierOn = false;
                } else {
                    message("You turn on the identifier and hear a hum.")
                    playSound("powerup", "sfx",0, false, -2500)
                    gm.identifierOn = true;
                }

            }

            // alcohols
            if (name === "Beer") {
                message("Cheers!")
                playSound("drinking-noise", "sfx", 0, false, k.randi(-500, -200));
                gm.intoxication += 1;
            }
            if (name === "Grog") {
                message("Tastes bland.")
                playSound("drinking-noise", "sfx", 0, false, k.randi(-500, -200));
                gm.intoxication += 2;
            }
            if (name === "Red Rum") {
                message("This stuff is quite strong!")
                playSound("drinking-noise", "sfx", 0, false, k.randi(-500, -200));
                gm.intoxication += 3;
            }
            if (name === "Coffee") {
                message("You happily drink the coffee, it tastes good.")
                playSound("drinking-noise", "sfx");
                gm.intoxication += 1;
            }
            if (gm.intoxication >= 6) {
                await k.wait(2)
                message("You don't feel so good...")

                await k.wait(2)
                message("Hurrghlllhhghhh")
                playSound("chomps", "sfx", 0, false, k.randi(-2500, -2400), 2);
                gm.intoxication = 0;
            }

            // Misc items
            if (name === "Fried Fish") {
                message("You consume the fried fish.")
                playSound("chomps", "sfx");
            }
            if (name === "Cards") {
                if (!gm.logPopupOpen) return;
                message("You shuffle the cards for fun.")
                playSound("cards", "sfx");
            }
            if (name === "Glasses") {
                message("You got some dandruff on the glasses.")
                await k.wait(1.5)
                message("You wipe them clean.")
                playSound("powerup", "sfx");
                if (k.chance(0.3)) {
                    endlessCleaning()
                }
            }
            if (name === "Dice") {
                message("You roll the dice...")
                playSound("dice-roll", "sfx");
                await k.wait(2)
                const dicenum = k.randi(2,13)
                message(`...you rolled: ${dicenum}`)
                if (dicenum === 12) {
                    playSound("fish-caught", "sfx")
                    await k.wait(1)
                    message(`Nice!`)
                    await k.wait(1.5)
                    message(`You also find 20 bucks in your pocket.`)
                    await k.wait(1.5)
                    message(`How fortunate.`)
                    gm.addMoney(20);
                }
                if (dicenum === 2) {
                    playSound("fish-escaped", "sfx")
                    await k.wait(1)
                    message(`Unlucky!`)
                }
            }
            if (icon.data.name === "Pipe") {
                message(`You relax for a bit.`)
                playSound("pipe", "sfx");
            }
            // TODO: randomise selected sounds for these
            if (icon.data.name === "Birdfeed") {
                message(`You throw some pellets at the bird.`)
                playSound("bird3", "sfx");
            }
            if (icon.data.name === "Bugfeed") {
                message(`You throw some pellets at the bug.`)
                playSound("night-bug-1", "sfx");
            }
        })
    }

    closeBtn.onHover(() => {
        hoverProcess(closeBtn)
    });
    closeBtn.onClick(() => {
        clickProcess(closeBtn)
        popupObjects.forEach(obj => obj.destroy());
        gm.currentRodIcon = null
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




export function equipRod(rod: RodObj, currentIcon: GameObj) {
    playSound("icon-sound-1", "sfx", 0, false, 2000)
    ROD_DATA.forEach(r => r.selected = false);
    rod.selected = true;
    if (gm.currentRodIcon) {
        gm.currentRodIcon.color = COLORS.WHITE;
    }
    gm.equipRod(rod.rodId.toString());

    currentIcon.color = COLORS.LIGHTGREEN
    gm.currentRodIcon = currentIcon;
}

async function splashSounds() {
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-3000, -2000));
    await k.wait(0.3)
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-1000, -2000));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-2000, -1000));
    await k.wait(0.1)
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-3000, -2000));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-3000, -1000));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(-4000, -2000));
}

async function thunkSounds() {
    playSound("fishing-thunk", "sfx", 0, false, k.randi(300, 200));
    await k.wait(0.3)
    playSound("fishing-thunk", "sfx", 0, false, k.randi(1000, 2000));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(200, 100));
    await k.wait(0.1)
    playSound("fishing-thunk", "sfx", 0, false, k.randi(3000, 20));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(300, 1000));
    playSound("fishing-thunk", "sfx", 0, false, k.randi(40, 200));
}

async function endlessCleaning() {
    await k.wait(1.5)
    message("Hold on...There's some more marks.")
    await k.wait(1.5)
    message("You try to clean them.")
    playSound("powerup", "sfx");
    if (k.chance(0.8)){
        await k.wait(1.5)
        message("You notice they are still dirty.")
        playSound("rancid-gloop", "sfx");
        await k.wait(1.5)
        message("You wipe them clean again.")
        playSound("powerup", "sfx");
        endlessCleaning()
    } else {
        await k.wait(1.5)
        message("You finally cleaned them!")
        playSound("rare-catch", "sfx", 0, false, k.randi(300, 1000))
    }

}