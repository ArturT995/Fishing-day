import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import { FISH_DATA } from "../db";
import gm from "../gm";
import k from "../kaplayCtx";
import { play } from "../sounds";
import { makeContainer, makeButton, alignObj, makeSlider, makeIcons } from "../ui";


export function shop() {
    k.scene("shop", () => {
        k.setCursor("default");
        let bgMusic = play("night-shop-1", "music", 0, true)
        const bg = k.add([
            k.sprite("shop-bg"),
            k.anchor("center"),
            k.color(COLORS.BEIGE),
            k.area(),
            k.pos(k.center()),
            k.opacity(0.5),
            k.z(2),
        ])
        //addSprite("shop")
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

            const leftSliderContainer = makeContainer("center", COLORS.DARKBLUE, 
                6, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
            alignObj(leftSliderContainer ,shopMenuContainer, 0, 0, 0, "topleft")
            makeSlider(COLORS.BROWN, leftSliderContainer, "vertical", "scroll", (val) => val);

            const rightSliderContainer = makeContainer("center", COLORS.DARKBLUE, 
                6, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
            alignObj(rightSliderContainer ,shopMenuContainer, 0, 0, 0, "topright")
            makeSlider(COLORS.BROWN, rightSliderContainer, "vertical", "scroll", (val) => val);


            const leftBuyContainer = makeContainer("center", COLORS.BLUE, 
                shopMenuContainer.width/2 - leftSliderContainer.width, 
                shopMenuContainer.height - BotContainer.height, 0.5)
            //alignObj(leftBuyContainer ,shopMenuContainer, leftSliderContainer.width, 0, 0, "topleft")

            const rightSellContainer = makeContainer("center", COLORS.BLUE, 
                shopMenuContainer.width/2 - rightSliderContainer.width, 
                shopMenuContainer.height - BotContainer.height, 0.5)
            //alignObj(rightSellContainer , shopMenuContainer, rightSliderContainer.width, 0, 0, "center")
            
            rightSellContainer.pos.y -= 10;
            rightSellContainer.pos.x = k.width()/2 + rightSellContainer.width/2

            leftBuyContainer.pos.y -= 10;
            leftBuyContainer.pos.x = k.width()/2 - leftBuyContainer.width/2;

            const hideBtn = makeButton("Close", 8, COLORS.BLUE, BotContainer, "static")
            alignObj(hideBtn, BotContainer, 5, -2, 3, "botright")
            
            const popupObjects = [BotContainer, leftSliderContainer, 
                rightSliderContainer, leftBuyContainer, rightSellContainer, hideBtn]

            const rightIcons = makeIcons(rightSellContainer, popupObjects, FISH_DATA, 3, 5)

            const leftIcons = makeIcons(leftBuyContainer, popupObjects, FISH_DATA, 3, 5)

            

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

        function buyItem(itemId: string, price: number) {
            if (gm.itemsUnlocked.includes(itemId)) {
                k.debug.log("You already own this!")
                return;
            }

            // check gold, save new gold amount.

            gm.unlockItem(itemId);
            k.debug.log(`Purchased ${itemId}!`);
        }
    
        k.onSceneLeave(() => {
            bgMusic.stop();
        });
    })
};