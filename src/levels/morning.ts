import { addSprite } from "../assetLoader";
import k from "../kaplayCtx";




export function morningScene() {
k.scene("morning", () => {
    k.setCursor("default");
    addSprite("morning") //add a bg sprite for morning
    const bgMusic = k.play("bg-music", {volume: 0.4, loop: true});

});

};
