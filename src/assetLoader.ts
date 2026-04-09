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

    //k.loadSound("bg-music", "./sounds/menu-bg-slower.ogg");
    //loadSound("menu-bg-1")

    /*
    k.loadSound("fishing-music", "./sounds/fishing-bg-1.ogg");
    k.loadSound("sea", "./sounds/sea.ogg");

    k.loadSound("icon", "./sounds/icon-sound-2.ogg");
    k.loadSound("icon2", "./sounds/icon-sound-1.ogg");
    k.loadSound("thunk", "./sounds/fishing-thunk.ogg");
    k.loadSound("laughing-bird", "./sounds/laughing-bird.ogg");
    */

    soundGen(soundsList)

    fishGen(fishesList)

};


function soundGen(list: string[]) {
    for (let asset of list) {
        loadSound(asset)
    }
}
function fishGen(list: string[]) {
    for (let asset of list) {
        loadFish(asset)
    }
}


function loadSound(name: string) {
    return k.loadSound(`${name}`,`./sounds/${name}.mp3`)
};
function loadFish(name: string) {
    return k.loadSprite(`${name}`,`./graphics/fishes/${name}.png`)
};



export function addSprite(name: string, ...components: Comp[]) {
    if (!k.getSprite(name)) {
        k.debug.log(`Sprite not loaded: ${name}`);
        throw new Error(`Sprite not loaded: ${name}`);
    }
    return k.add([k.sprite(name), ...components]);
};




let soundsList = [
  "bird1",
  "bird2",
  "bird3",
  "boss1",
  "cards",
  "chomps",
  "crabclack",
  "day-bg-3",
  "day-bg-4",
  "day-bird-2",
  "day-bird-3",
  "dice-roll",
  "drinking-noise",
  "fast-tune",
  "fish-caught",
  "fish-escaped",
  "menu-bg-1",
  "fishing-bg-1",
  "fishing-bg-2",
  "fishing-bg-3",
  "fishing-thunk",
  "fly",
  "flying-2",
  "frog-1",
  "frog-2",
  "icon-sound-1",
  "icon-sound-2",
  "item-bought",
  "laughing-bird",
  "mosquito",
  "new-fish-caught",
  "new-fish-unlocked",
  "night-bg-1",
  "night-bg-2",
  "night-bird-1",
  "night-bird-2",
  "night-bird-3",
  "night-bird-4",
  "night-bug-1",
  "night-bug-2",
  "night-menu-1",
  "night-shop-1",
  "pipe",
  "powerbar",
  "powerup",
  "rancid-gloop",
  "rare-catch",
  "rare-sell",
  "sea",
  "sell-item",
  "shaking",
  "thumping",
  "wind"
]

let fishesList = 
[
  "alligator-gar-locked",
  "alligator-gar",
  "carp-locked",
  "carp",
  "esox-locked",
  "esox",
  "fishbones-locked",
  "fishbones",
  "freshwater-drum-locked",
  "freshwater-drum",
  "ghostcarp-locked",
  "ghostcarp",
  "gildedfish-locked",
  "gildedfish",
  "spotted-gar-locked",
  "spotted-gar",
  "tench-locked",
  "tench",
  "yuppie-locked",
  "yuppie"
]