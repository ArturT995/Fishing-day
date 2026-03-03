import { addSprite } from "../assetLoader";
import { COLORS, fontConfigSmall } from "../constants";
import k from "../kaplayCtx";




export function morning() {
k.scene("morning", () => {
    k.setCursor("default");
    addSprite("morning") //add a bg sprite for morning
    const bgMusic = k.play("fishing-music", {volume: 0.5, loop: true});
    //add more tracks later, start with random one
    const seaSound = k.play("sea", {volume: 0.1, loop: true}); 
    //remember to load assets for any sound you add


    const start = k.add([
        k.text("Back to menu", fontConfigSmall),
        k.anchor("center"),
        k.pos(k.center().x, k.height() - 10),
        k.color(COLORS.BEIGE),
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
        if (canPlayBird && k.randi(1, 10) > 8) {
            canPlayBird = false;
            const birdSound = k.play("laughing-bird", { volume: 0.3 });
            birdSound.onEnd(() => {
                canPlayBird = true;
            });
        }
    });

    
    //add bird laughing sound sometimes when u fail to catch a fish

    k.onSceneLeave(() => {
        bgMusic.stop();
        seaSound.stop();
    });
});

};
