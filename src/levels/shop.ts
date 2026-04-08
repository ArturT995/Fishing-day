import { addSprite } from "../assetLoader";
import { COLORS } from "../constants";
import k from "../kaplayCtx";
import { makeContainer, makeButton, alignObj } from "../ui";


export function shop() {
    k.scene("shop", () => {
        k.setCursor("default");

        //addSprite("shop")
        //addSprite("shopPopupBorders")


        //overlay borders with a sprite on these
        const shopMenuContainer = makeContainer("center", COLORS.BEIGE, 
            k.width() - 20 , k.height() - (k.width()/6), 0)
        

        const BotContainer = makeContainer("bot", COLORS.BLUE, 
            shopMenuContainer.width, 20, 0.5, shopMenuContainer)
        alignObj(BotContainer ,shopMenuContainer, 0, 0, 0, "bot")

        const leftSliderContainer = makeContainer("left", COLORS.BLUE, 
            10, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(leftSliderContainer ,shopMenuContainer, 0, 0, 0, "topleft")

        const rightSliderContainer = makeContainer("left", COLORS.BLUE, 
            10, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(rightSliderContainer ,shopMenuContainer, 0, 0, 0, "topright")

        const leftSellContainer = makeContainer("right", COLORS.DARKBLUE, 
            shopMenuContainer.width/2 - leftSliderContainer.width, 
            shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(leftSellContainer ,shopMenuContainer, leftSliderContainer.width, 0, 0, "topleft")

        const rightBuyContainer = makeContainer("right", COLORS.DARKBLUE, 
            shopMenuContainer.width/2 - rightSliderContainer.width, 
            shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(rightBuyContainer ,shopMenuContainer, -rightSliderContainer.width, 0, 0, "topright")



        /*
        const shopMenu3 = makeContainer("center", COLORS.DARKRED, 40, 16, 1, shopMenu)

        const testButton1 = makeButton("test", 20, COLORS.DARKBLUE, shopMenu, "static")
        const testButton2 = makeButton("test2awaawaw", 6, COLORS.DARKBLUE, shopMenu, "dynamic")
        const testButton4 = makeButton("test2awaawaw", 6, COLORS.DARKBLUE, shopMenu, "dynamic")
        const testButton5 = makeButton("test2awaawaw", 6, COLORS.DARKBLUE, shopMenu, "dynamic")
        const testButton3 = makeButton("test3", 6, COLORS.DARKBLUE, shopMenu, "static")
        
        alignObj(testButton1 ,shopMenu, 2, 4, 2, "topleft")
        alignObj(testButton2 ,shopMenu, 0, 0, 2, "left")
        alignObj(testButton4 ,shopMenu, 0, 6, 2, "left")
        alignObj(testButton5 ,shopMenu, 0, 12, 2, "left")
        alignObj(testButton3 ,shopMenu, 0, 0, 0, "botright")
        
        alignObj(shopMenu2 ,shopMenu, 0, 0, 0, "popbotright")
        const testButton7 = makeButton("$00300", 8, COLORS.YELLOW, shopMenu2, "static")
        alignObj(testButton7 ,shopMenu2, 2, -4, 0, "topleft")
        
        alignObj(shopMenu3 ,shopMenu, 0, -16, 0, "popbotright")
        const testButton8 = makeButton("$00500", 8, COLORS.YELLOW, shopMenu3, "static")
        alignObj(testButton8 ,shopMenu3, 2, -4, 0, "topleft")
        */


    })
}