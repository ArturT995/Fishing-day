import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import { ANCHOR } from "../entities/fishes";
import { generateFishes, throwLine } from "../fishing";
import k from "../kaplayCtx";




export function day() {
    k.scene("day", () => {
        k.setCursor("default");
        addSprite("day") //add a bg sprite for morning
        const bgMusic = k.play("fishing-music", {volume: 0.5, loop: true});
        //add more tracks later, start with random one
        const seaSound = k.play("sea", {volume: 0.1, loop: true}); 
        //remember to load assets for any sound you add

        //make into a popup that has option to go back or adjust settings etc.
        const start = k.add([
            k.text("Menu", fontConfigSmall),
            k.anchor("left"),
            k.pos(k.width()-20, k.height() - 5),
            k.color(COLORS.BLUE),
            k.area(),
            k.scale(1),
            k.rotate(0),
            k.z(3),
        ]);

        start.onClick(() => {
            k.go("main-menu");
        })

        //add random sounds into onUpdate that run every now and then
        let canPlayBird = true;
        k.loop(3, () => {
            if (canPlayBird && k.randi(1, 9) > 8) {
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
            k.color(COLORS.RED),
            "player"
        ]);


        generateFishes()
    


        const existingBobber = k.get("bobber");
        k.onClick(() => {
            if (existingBobber.length > 0) {
                return;
            }
            throwLine(ANCHOR, 3)
        });

        k.onDraw(() => {
            const bobbers = k.get("bobber");
            if (bobbers.length > 0) {
                k.drawLine({
                    p1: ANCHOR,
                    p2: bobbers[0].pos,
                    width: 0.2,
                    color: k.rgb(200, 200, 200),
                    opacity: 0.5,
                });
            }
        });


        const reelSound = k.play("icon2", { volume: 1.0, loop: true, detune: 3200, speed: 12 });
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
        });
    });

};
