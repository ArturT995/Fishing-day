import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import { FISH_DATA, ITEM_DATA, type FishObj, type ShopObj } from "../db";
import gm from "../gm";
import k from "../kaplayCtx";
import { play } from "../sounds";
import { makeContainer, makeButton, alignObj, makeIcons } from "../ui";


export function shop() {
    k.scene("shop", () => {
        k.setCursor("default");
        let bgMusicShop = play("night-shop-1", "music", 0, true)
        const bg = k.add([
            k.sprite("shop-bg"),
            k.anchor("center"),
            k.color(COLORS.BEIGE),
            k.area(),
            k.pos(k.center()),
            k.opacity(0.5),
            k.z(2),
        ])

        //addSprite("shopPopupBorders")

        shopPopup()

        function shopPopup() {
            gm.logPopupOpen = true
            //overlay borders with a sprite on these
            const shopMenuContainer = makeContainer("center", COLORS.BEIGE, 
                k.width() - 10 , k.height() - (k.width()/5), 0)
            
            const BotContainer = makeContainer("center", COLORS.DARKBLUE,
                shopMenuContainer.width, 20, 0.5, shopMenuContainer)
            alignObj(BotContainer ,shopMenuContainer, 0, 0, 0, "bot")

            

            const leftBuyContainer = makeContainer("center", COLORS.BLUE, 
                shopMenuContainer.width/2, 
                shopMenuContainer.height - BotContainer.height, 0.5)

            const rightSellContainer = makeContainer("center", COLORS.BLUE, 
                shopMenuContainer.width/2, 
                shopMenuContainer.height - BotContainer.height, 0.5)

            
            rightSellContainer.pos.y -= 10;
            rightSellContainer.pos.x = k.width()/2 + rightSellContainer.width/2

            leftBuyContainer.pos.y -= 10;
            leftBuyContainer.pos.x = k.width()/2 - leftBuyContainer.width/2;

            const hideBtn = makeButton("Close", 8, COLORS.BLUE, BotContainer, "static")
            alignObj(hideBtn, BotContainer, 5, -2, 3, "botright")
            
            const popupObjects = [BotContainer, leftBuyContainer, rightSellContainer, hideBtn]


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


            const moneyButton = makeButton(`${gm.money}$`, 8, COLORS.BEIGE, BotContainer, "static")
            alignObj(moneyButton, BotContainer, 40, -2, 3, "botright")

            //sell
            for (let iconR of rightIcons) {
                iconR.onClick(() => {
                    if (iconR.opacity === 0) return;
                    const id = iconR.objId.toString();
                    gm.removeFish(id);
                    (iconR.price >= 100) ? play("rare-sell", "sfx") : play("sell-item", "sfx");
                    gm.addMoney(iconR.price);
                    moneyButton.text = `${gm.money}$`
                    iconR.destroy();
                    k.debug.log(`Sold fish ID: ${id}`);
                })
            }

            //buy
            for (let iconL of leftIcons) {
                iconL.onClick(() => {
                    if (iconL.opacity === 0) return;
                    if (iconL.price > gm.money) {
                        k.debug.log(`No money for that`);
                        return;
                    }                
                    const id = iconL.objId.toString();
                    play("item-bought", "sfx")
                    gm.unlockItem(id)
                    gm.removeMoney(iconL.price);
                    moneyButton.text = `${gm.money}$`
                    k.debug.log(iconL.data.feature)
                    if (iconL.data.feature.includes("Unique")) iconL.destroy();

                    k.debug.log(`Bought item ID: ${id}`);
                })
            }

            hideBtn.onClick(() => {
                gm.logPopupOpen = false
                popupObjects.forEach(obj => obj.destroy())
            })
        };



        const showBtn = k.add([
            k.text("Shop", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-60, k.height() - 5),
            k.color(COLORS.BEIGE),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);

        showBtn.onClick(() => {
            if (gm.logPopupOpen) return;
            shopPopup();
        })


        const levelBtn = k.add([
            k.text("Back", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-40, k.height() - 5),
            k.color(COLORS.BEIGE),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);

        levelBtn.onClick(() => {
            k.go("day");
        })


        k.onSceneLeave(() => {
            bgMusicShop.stop();
            gm.logPopupOpen = false
        });
    })
};