import { addSprite } from "../assetLoader";
import { COLORS } from "../constants";
import k from "../kaplayCtx";
import { makeContainer, makeButton, alignObj, makeSlider } from "../ui";


export function shop() {
    k.scene("shop", () => {
        k.setCursor("default");
        const bg = k.add([
            k.rect(k.width(),k.height()),
            k.anchor("center"),
            k.color(COLORS.BEIGE),
            k.area(),
            k.pos(k.center()),
            k.opacity(0.5),
            k.z(2),
        ])
        //addSprite("shop")
        //addSprite("shopPopupBorders")


        //overlay borders with a sprite on these
        const shopMenuContainer = makeContainer("center", COLORS.BEIGE, 
            k.width() - 20 , k.height() - (k.width()/6), 0)
        

        const BotContainer = makeContainer("bot", COLORS.BLUE, 
            shopMenuContainer.width, 20, 0.5, shopMenuContainer)
        alignObj(BotContainer ,shopMenuContainer, 0, 0, 0, "bot")

        const leftSliderContainer = makeContainer("left", COLORS.BLUE, 
            6, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(leftSliderContainer ,shopMenuContainer, 0, 0, 0, "topleft")
        makeSlider(COLORS.BEIGE, leftSliderContainer, "vertical", "volume", (val) => {k.setVolume(val)});

        const rightSliderContainer = makeContainer("left", COLORS.BLUE, 
            6, shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(rightSliderContainer ,shopMenuContainer, 0, 0, 0, "topright")
        makeSlider(COLORS.BEIGE, rightSliderContainer, "vertical", "volume", (val) => {k.setVolume(val)});


        const leftSellContainer = makeContainer("right", COLORS.DARKBLUE, 
            shopMenuContainer.width/2 - leftSliderContainer.width, 
            shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(leftSellContainer ,shopMenuContainer, leftSliderContainer.width, 0, 0, "topleft")

        const rightBuyContainer = makeContainer("right", COLORS.DARKBLUE, 
            shopMenuContainer.width/2 - rightSliderContainer.width, 
            shopMenuContainer.height - BotContainer.height, 1, shopMenuContainer)
        alignObj(rightBuyContainer ,shopMenuContainer, rightSliderContainer.width, 0, 0, "topright")



        /*




        let volumeContainerVert = makeContainer("right", COLORS.BEIGE, 
                10, settingsMenu.height/2,  1, settingsMenu)
        alignObj(volumeContainerVert, settingsMenu, 0, 0, 10, "topright")
        makeSlider(COLORS.RED, volumeContainerVert,"vertical", "volume", (val) => {k.setVolume(val)});

        let volumeContainerBot = makeContainer("bot", COLORS.BEIGE, 
                settingsMenu.width/4, 10,  1, settingsMenu)
        alignObj(volumeContainerBot, settingsMenu, 0, 0, 10, "bot")
        makeSlider(COLORS.RED, volumeContainerBot,"horizontal", "volume", (val) => {k.setVolume(val)});

        let volumeContainerBotLeft = makeContainer("bot", COLORS.BEIGE, 
                10, settingsMenu.width/4,  1, settingsMenu)
        alignObj(volumeContainerBotLeft, settingsMenu, 0, 0, 10, "botleft")
        makeSlider(COLORS.RED, volumeContainerBotLeft, "vertical", "volume", (val) => {k.setVolume(val)});

        let volumeContainerCenter = makeContainer("center", COLORS.BEIGE, 
                settingsMenu.width/4, 10,  1, settingsMenu)
        alignObj(volumeContainerCenter, settingsMenu, 0, 0, 0, "center")
        makeSlider(COLORS.RED, volumeContainerCenter, "horizontal", "volume", (val) => {k.setVolume(val)});


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