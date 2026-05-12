import { addSprite } from "../assetLoader";
import { openBag } from "../bag";
import { COLORS, fishingArea, fontConfigSmall } from "../constants";
import { ANCHOR, generateFishes } from "../entities/fishes";
import { throwLine } from "../fishing";
import gm from "../gm";
import k from "../kaplayCtx";
import { playSound } from "../sounds";
import { clickProcess, hoverProcess } from "../ui";
import { openCollectionLog, openSettings } from "./menu";
import type { GameObj } from "kaplay";



export async function day() {
    k.scene("day", () => {
        let canCast = false;
    
        // Wait a tiny bit of time before allowing input
        k.wait(0.5, () => canCast = true);
        k.setCursor("default");
        addSprite("sea")
        // TODO: update the sea sprite to use the same one as in the menu.
        addSprite("ground", k.z(2))
        const waves = k.add([k.sprite("waves"), k.z(1)])
        waves.play("normal");

        //add crab and bird sprites
        const bgMusic = k.play("fishing-bg-1", {volume: 0.5, loop: true});
        //add more tracks later, start with random one
        const seaSound = k.play("sea", {volume: 0.1, loop: true}); 
        //remember to load assets for any sound you add

        //make a popup that has option to go back or adjust settings.

        // TODO: add a pier or change rod position so its less awkward to fish
        /*
        const rodArea = k.add([
            k.circle(40),
            k.pos(k.width()/2, k.height()),
            k.area(),
            k.opacity(0.3),
            "rodArea",
            k.z(44)
        ]);
        */

        // TODO: Change button positions, put shop btn to left, next to bag.

        const PADDING = 5;

        const menuBtn = k.add([
            k.text("Menu", fontConfigSmall),
            k.anchor("right"),
            k.pos(k.width()-PADDING, k.height() - 5),
            k.color(COLORS.DARKRED),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);
        menuBtn.onHover(() => hoverProcess(menuBtn))
        menuBtn.onClick(() => {
            clickProcess(menuBtn)
            let bobber = k.get("bobber");
            if (bobber.length !== 0) return;
            k.go("main-menu");
        })

        const shopBtn = k.add([
            k.text("Shop", fontConfigSmall),
            k.anchor("right"),
            k.pos(k.width()-(PADDING+20), k.height() - 5),
            k.color(COLORS.DARKRED),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);
        shopBtn.onHover(() => hoverProcess(shopBtn))
        shopBtn.onClick(() => {
            let bobber = k.get("bobber");
            if (bobber.length !== 0) return;
            clickProcess(shopBtn)
            k.go("shop");
        })

        const logBtn = k.add([
            k.text("Collection Log", fontConfigSmall),
            k.anchor("left"),
            k.pos(PADDING, k.height() - 5),
            k.color(COLORS.DARKRED),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);
        logBtn.onHover(() => hoverProcess(logBtn))
        logBtn.onClick(() => {
            let bobber = k.get("bobber");
            if (bobber.length !== 0) return;
            clickProcess(logBtn)
            openCollectionLog();
        })

        const settingsBtn = k.add([
            k.text("Settings", fontConfigSmall),
            k.anchor("left"),
            k.pos(PADDING+42, k.height() - 5),
            k.color(COLORS.DARKRED),
            k.area(),
            k.scale(1),
            k.z(3),
            "settingsBtn"
        ]);
        settingsBtn.onHover(() => hoverProcess(settingsBtn))
        settingsBtn.onClick(() => {
            let bobber = k.get("bobber");
            if (bobber.length !== 0) return;
            clickProcess(settingsBtn)
            openSettings();
        })

        const bagBtn = k.add([
            k.text("Bag", fontConfigSmall),
            k.anchor("left"),
            k.pos(PADDING+70, k.height() - 5),
            k.color(COLORS.DARKRED),
            k.area(),
            k.scale(1),
            k.z(3),
            "bagBtn"
        ]);
        bagBtn.onHover(() => hoverProcess(bagBtn))
        bagBtn.onClick(async () => {
            let bobber = k.get("bobber");
            if (bobber.length !== 0) return;
            clickProcess(bagBtn)
            await k.wait(0.1)
            openBag();
        })

        //add more random sounds into onUpdate that run every now and then
        let canPlayBird = true;
        k.loop(3, () => {
            if (canPlayBird && k.rand(1, 9) > 8) {
                canPlayBird = false;
                const birdSound = k.play("laughing-bird", { volume: 0.3 });
                birdSound.onEnd(() => {
                    canPlayBird = true;
                });
            }
        });

        k.add([
            k.pos(k.vec2(k.width() / 2, k.height() -5)),
            k.anchor("center"),
            k.rect(2,14),
            k.z(3),
            k.color(COLORS.RED),
            "player"
        ]);


        generateFishes()
    

        const powerBar = k.add([
                k.rect(2,0),
                k.pos(ANCHOR.x + 7, ANCHOR.y + 6),
                k.color(COLORS.GREEN),
                k.anchor("bot"),
                k.rotate(0),
                k.z(5),
                k.opacity(0.8)
            ])
        const powerBarBox = k.add([
                k.rect(3,8),
                k.pos(ANCHOR.x + 7, ANCHOR.y + 6),
                k.color(COLORS.BLACK),
                k.anchor("bot"),
                k.z(4),
                k.outline(1 , COLORS.ORANGE),
                k.rotate(0),
                k.opacity(0)
            ])
        
        let power = 0;
        k.onMouseDown("left", () => {
            if (!canCast) return;
            if (gm.logPopupOpen) return;
            if (gm.state === "catching") return;
            const bobber = k.get("bobber")[0]
            if(bobber) return;

            playSound("icon-sound-1", "sfx", -0.9)
            power += 0.05
            powerBar.height += 0.12;
            powerBarBox.opacity = 1;
            if (powerBar.height > 8) {
                let random = k.randi(0,4)
                powerBar.angle = random;
                powerBarBox.angle = random;
                powerBar.height = 8} 
        });
        
        

        k.onMouseRelease("left", () => {
            if (gm.logPopupOpen) return;
            if (!canCast) return;
            powerBar.height = 0;
            powerBarBox.opacity = 0;
            powerBar.angle = 0;
            powerBarBox.angle = 0;
            const dir = k.mousePos().sub(ANCHOR).unit();

            const existingBobber = k.get("bobber");
            if (existingBobber.length > 0) return;
            
            if (power > 4) power = 4;
            if (power < 0.5) power = 0.5;
            
            let targetPos = ANCHOR.add(dir.scale(power * 50))
            while (!fishingArea.hasPoint(targetPos) && power > 1.7) {
                power -= 0.1
                targetPos = ANCHOR.add(dir.scale(power * 50));
            }

            
            throwLine(ANCHOR, power)
            power = 0;
        });

        k.onDraw(() => {
            const bobber = k.get("bobber")[0];
            if (bobber) {
                k.drawLine({
                    p1: ANCHOR,
                    p2: bobber.pos,
                    width: 0.2,
                    color: k.rgb(200, 200, 200),
                    opacity: 0.5,
                });
            }
        });


        const reelSound = k.play("icon-sound-1", { volume: 1.0, loop: true, detune: 3200, speed: 12 });
        reelSound.volume = 0;
        const flySound = k.play("icon-sound-1", { volume: 1.0, loop: true, detune: 3200, speed: 16 });
        flySound.volume = 0;

        k.onUpdate(() => {
            if (gm.logPopupOpen) return;
            const bobber = k.get("bobber")[0];
            if (bobber && (bobber.state === "flying")) {
                flySound.volume = 2;
            } else {
                flySound.volume = 0;
            }

            let mouse = k.mousePos();

            if (mouse.y < k.height() - 10 && fishingArea.hasPoint(mouse)) {
                canCast = true;
            } else {
                canCast = false;
            }
        })

        k.onMouseDown("right", () => {
            const bobber = k.get("bobber")[0];
            if (bobber && (bobber.state === "floating" || bobber.state === "reeling")) {
                bobber.enterState("reeling");
                reelSound.volume = 1.8;
            }
        });

        k.onMouseRelease("right", () => {
            reelSound.volume = 0;
            const bobber = k.get("bobber")[0];
            if(bobber) bobber.enterState("floating");
        });


        //add bird laughing sound sometimes when u fail to catch a fish
        k.onSceneLeave(() => {
            gm.currentFishID = "";
            bgMusic.stop();
            seaSound.stop();
            reelSound.stop();
            flySound.stop()
            waves.stop();
        });
    });
    
};
