import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import { ANCHOR, generateFishes } from "../entities/fishes";
import { throwLine } from "../fishing";
import k from "../kaplayCtx";




export async function day() {
    k.scene("day", () => {
        k.setCursor("default");
        addSprite("sea")
        addSprite("ground", k.z(2))
        const foam = k.add([k.sprite("foam"), k.z(1)])
        foam.play("normal");

        //add crab and bird sprites
        const bgMusic = k.play("fishing-bg-1", {volume: 0.5, loop: true});
        //add more tracks later, start with random one
        const seaSound = k.play("sea", {volume: 0.1, loop: true}); 
        //remember to load assets for any sound you add

        //make a popup that has option to go back or adjust settings.



        const menuBtn = k.add([
            k.text("Menu", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-20, k.height() - 5),
            k.color(COLORS.BLUE),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);

        menuBtn.onClick(() => {
            k.go("main-menu");
        })

        const shopBtn = k.add([
            k.text("Shop", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-40, k.height() - 5),
            k.color(COLORS.BLUE),
            k.area(),
            k.scale(1),
            k.z(3),
        ]);

        shopBtn.onClick(() => {
            k.go("shop");
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
    



        let power = 0;
        k.onMouseDown("left", () => {
            k.play("icon-sound-1", {volume: 0.1})
            power += 0.03
        });
        
        if (k.isMouseDown("left")) {
            k.play("icon-sound-1")
        }

        k.onMouseRelease("left", () => {
            const existingBobber = k.get("bobber");
            if (existingBobber.length > 0) {
                return;
            }
            if (power > 4) power = 4;
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
            bgMusic.stop();
            seaSound.stop();
            reelSound.stop();
            foam.stop();
        });
    });
    
};
