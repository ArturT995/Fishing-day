import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import { FISH_DATA, ITEM_DATA, type FishObj, type ShopObj } from "../db";
import gm from "../gm";
import k from "../kaplayCtx";
import { playSound } from "../sounds";
import { makeContainer, makeButton, alignObj, makeIcons, clickProcess, hoverProcess } from "../ui";


export function shop() {
    k.scene("shop", () => {
        k.setCursor("default");
        let bgMusicShop = playSound("night-shop-1", "music", 0, true)
        let bg:any; //modify at night to be darker and bluer

        bg = k.add([
            k.sprite("shop-bg"),
            k.anchor("center"),
            k.color(),
            k.area(),
            k.pos(k.center()),
            k.opacity(0.7),
            k.z(2),
        ])
        let sellFlag = false;

        const smoke = k.add([k.sprite("smoke"),k.pos(67,54), k.z(2), k.opacity(0.7)])
        smoke.play("normal");

        //addSprite("shopPopupBorders")

        shopPopup()

        function shopPopup() {
            //overlay borders with a sprite on these
            if (gm.logPopupOpen) return;
            gm.logPopupOpen = true
            let POPUP_WIDTH = k.width() - 10 
            let POPUP_HEIGHT = k.height() - (k.width()/5)

            const blocker = makeContainer("center", COLORS.BLACK,
            k.width(), k.height(), 0.3)

            const shopMenuContainer = makeContainer("center", COLORS.BROWN, 
                POPUP_WIDTH , POPUP_HEIGHT+2, 0.5)
            
            const shopMenuBorder = k.add([
                k.sprite("shopborder"),
                k.anchor("center"),
                k.color(),
                k.pos(k.center()),
                k.z(4),
                "shop-Popup"
            ])


            const botContainer = makeContainer("center", COLORS.BLACK,
                shopMenuContainer.width, 20, 0.7, shopMenuContainer)
            alignObj(botContainer ,shopMenuContainer, 0, 0, 0, "bot")


            let icons = ["sunIcon", "moonIcon"]
            let chosenIcon = icons[k.randi()]
            const sunIcon = botContainer.add([
                k.sprite(chosenIcon),
                k.anchor("center"),
                k.pos(botContainer.x,botContainer.y),
                k.z(botContainer.z+1)
            ])
            alignObj(sunIcon ,botContainer, 0, 0, 0, "botleft")

            if (chosenIcon === "moonIcon") shopMenuBorder.color = COLORS.BLUE;

            const leftBuyContainer = makeContainer("center", COLORS.GRAYBLUE, 
                shopMenuContainer.width/2, 
                shopMenuContainer.height - botContainer.height, 0.6)

            const rightSellContainer = makeContainer("center", COLORS.GRAYBLUE, 
                shopMenuContainer.width/2, 
                shopMenuContainer.height - botContainer.height, 0.6)

            
            rightSellContainer.pos.y -= 10;
            rightSellContainer.pos.x = k.width()/2 + rightSellContainer.width/2

            leftBuyContainer.pos.y -= 10;
            leftBuyContainer.pos.x = k.width()/2 - leftBuyContainer.width/2;

            const hideBtn = makeButton("Close", 8, COLORS.ORANGE, botContainer, "static")
            alignObj(hideBtn, botContainer, 5, -2, 3, "botright")
            
            const popupObjects = [shopMenuContainer, botContainer, leftBuyContainer, rightSellContainer, hideBtn, blocker, shopMenuBorder, sunIcon]


            const caughtFishes = gm.fishCaught.map(id => {
                return FISH_DATA.find(obj => obj.fishId.toString() === id.toString());
            }).filter(obj => obj !== undefined) as FishObj[];

            const shopItems = ITEM_DATA.filter(obj => {
                if (obj.feature.includes("Unique") && gm.itemsUnlocked.some(id => id.toString() === obj.itemId.toString())) {
                    return false; // exclude unlocked unique items
                }
                return true;
            }) as ShopObj[];



            const rightIcons = makeIcons(rightSellContainer, popupObjects, caughtFishes, "right", 3, 5, true)

            const leftIcons = makeIcons(leftBuyContainer, popupObjects, shopItems, "left", 3, 5, true)


            const priceText = makeButton(`${gm.money}$`, 8, COLORS.ORANGE, botContainer, "static")
            alignObj(priceText, botContainer, 40, -2, 3, "botright")

            //sell
            for (let iconR of rightIcons) {
                iconR.onClick(() => {
                    if (gm.logpopupOpen === false) return;
                    if (iconR.opacity === 0) return;
                    const id = iconR.objId.toString();
                    gm.removeFish(id);
                    (iconR.price >= 100) ? playSound("rare-sell", "sfx") : playSound("sell-item", "sfx");
                    gm.addMoney(iconR.price);
                    priceText.text = `${gm.money}$`
                    iconR.destroy();
                    k.debug.log(`Sold fish ID: ${id}`);
                })
            }

            // BUG: doesnt update so u can spam it for gold, also doesnt sell fish off screen.
            //sellAll
            const sellAll = makeButton(`Sell All`, 8, COLORS.ORANGE, botContainer, "static")
            alignObj(sellAll, botContainer, 70, -2, 3, "botright")
            

            sellAll.onClick(() => {
                for (let iconR of rightIcons) {
                    if (gm.logpopupOpen === false) return;
                    if (sellFlag === true) return;
                    const id = iconR.objId.toString();
                    gm.removeFish(id);
                    (iconR.price >= 100) ? playSound("rare-sell", "sfx") : playSound("sell-item", "sfx");
                    gm.addMoney(iconR.price);
                    priceText.text = `${gm.money}$`
                    iconR.destroy();
                    k.debug.log(`Sold fish ID: ${id}`);
                };
                sellFlag = true;
            });
            

            //buy
            for (let iconL of leftIcons) {
                iconL.onClick(() => {
                    if (gm.logpopupOpen === false) return;
                    if (iconL.opacity === 0) return;
                    if (iconL.price > gm.money) {
                        k.debug.log(`No money for that`);
                        return;
                    }                
                    const id = iconL.objId.toString();
                    playSound("item-bought", "sfx")
                    gm.unlockItem(id)
                    gm.addItem(id)
                    gm.removeMoney(iconL.price);
                    priceText.text = `${gm.money}$`
                    if (iconL.data.feature.includes("Unique")) iconL.destroy();
                    k.debug.log(`Bought item ID: ${id}`);
                })
            }



            hideBtn.onClick(() => {
                clickProcess(hideBtn)
                popupObjects.forEach(obj => obj.destroy())
                gm.logPopupOpen = false
                sellFlag = false
            })
        };



        const showBtn = k.add([
            k.text("Shop", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-60, k.height() - 5),
            k.color(COLORS.ORANGE),
            k.opacity(0.7),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);
        showBtn.onHover(() => hoverProcess(showBtn))
        showBtn.onClick(async () => {
            if (gm.logPopupOpen) return;
            clickProcess(showBtn)
            await k.wait(0.05)
            shopPopup();
        })


        const levelBtn = k.add([
            k.text("Back", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-40, k.height() - 5),
            k.color(COLORS.ORANGE),
            k.opacity(0.7),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);
        levelBtn.onHover(() => hoverProcess(levelBtn))
        levelBtn.onClick(() => {
            clickProcess(levelBtn)
            
            k.go("day");
        })


        k.onSceneLeave(() => {
            bgMusicShop.stop();
            bg.destroy();
            smoke.stop();
            gm.logPopupOpen = false
            sellFlag = false
        });
    })
};