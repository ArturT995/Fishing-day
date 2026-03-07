import type { Comp } from "kaplay";
import k from "./kaplayCtx";


export async function assetLoader() {
    k.loadFont("happy", "./fonts/happy-font.ttf")

    k.loadSprite("bg1", "./graphics/gamebg.png")
    k.loadSprite("morning", "./graphics/gamebg.png") //placeholder duplicate, change to new sprite later.
    k.loadSprite("orangefishIcon", "./graphics/orangefish.png")
    k.loadSprite("bluefishIcon", "./graphics/bluefish.png")

    k.loadSound("bg-music", "./sounds/menu-bg-slower.ogg");
    k.loadSound("fishing-music", "./sounds/fishing-bg-1.ogg");
    k.loadSound("sea", "./sounds/sea.ogg");

    k.loadSound("icon", "./sounds/icon-sound-2.ogg");
    k.loadSound("thunk", "./sounds/fishing-thunk.ogg");
    k.loadSound("laughing-bird", "./sounds/laughing-bird.ogg");
}




export function addSprite(name: string, ...components: Comp[]) {
    if (!k.getSprite(name)) {
        k.debug.log(`Sprite not loaded: ${name}`);
        throw new Error(`Sprite not loaded: ${name}`);
    }
    return k.add([k.sprite(name), ...components]);
}