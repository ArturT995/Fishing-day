import type { Comp } from "kaplay";
import k from "./kaplayCtx";


export async function assetLoader() {
    k.loadFont("happy", "./fonts/happy-font.ttf")

    k.loadSprite("menu-bg", "./graphics/menu-bg.png")
    k.loadSprite("titlebox", "./graphics/titlebox.png")
    k.loadSprite("ground", "./graphics/ground.png")
    k.loadSprite("sea", "./graphics/sea.png")
    

    k.loadSprite("foam", "./graphics/foam.png", {
        sliceX: 3,
        anims: {
            "normal": {
                from: 0,
                to: 2,
                speed: 2,
                frames: [0,1,2,1,0,1],
                loop: true,
            },
            "fast": {
                from: 2,
                to: 0,
                speed: 3,
                loop: true,
            },
        },
    })

    k.loadSprite("orangefishIcon", "./graphics/orangefish.png")
    k.loadSprite("bluefishIcon", "./graphics/bluefish.png")

    k.loadSound("bg-music", "./sounds/menu-bg-slower.ogg");
    k.loadSound("fishing-music", "./sounds/fishing-bg-1.ogg");
    k.loadSound("sea", "./sounds/sea.ogg");

    k.loadSound("icon", "./sounds/icon-sound-2.ogg");
    k.loadSound("icon2", "./sounds/icon-sound-1.ogg");
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