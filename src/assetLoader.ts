import type { Comp } from "kaplay";
import k from "./kaplayCtx";


export async function assetLoader() {

    k.loadFont("happy", "./fonts/Easy-Pixel.ttf")

    k.loadSprite("dayMenuScreen", "./graphics/dayMenuScreen.png")
    k.loadSprite("nightMenuScreen", "./graphics/nightMenuScreen.png")
    
    k.loadSprite("sunIcon", "./graphics/sunIcon.png")
    k.loadSprite("moonIcon", "./graphics/moonIcon.png")
    
    k.loadSprite("cursor1", "./graphics/cursor1.png")
    k.loadSprite("cursor2", "./graphics/cursor2.png")

    k.loadSprite("shop-bg", "./graphics/shop-bg.png")
    k.loadSprite("night-shop", "./graphics/night-shop.png")
    k.loadSprite("shopborder", "./graphics/shopborder.png")

    k.loadSprite("pier", "./graphics/pier.png")
    k.loadSprite("pier-night", "./graphics/pier-night.png")
    k.loadSprite("ground", "./graphics/ground.png")
    k.loadSprite("sea", "./graphics/sea.png")
    k.loadSprite("night-ground", "./graphics/night-ground.png")
    k.loadSprite("night-sea", "./graphics/night-sea.png")

    k.loadSprite("endscene", "./graphics/endscene.png")

    k.loadSprite("waves", "./graphics/waves.png", {
        sliceX: 4,
        anims: {
            "normal": {
                from: 0,
                to: 3,
                speed: 3,
                frames: [0,1,2,3,2,1],
                loop: true,
            },
        },
    })
    k.loadSprite("waves-night", "./graphics/waves-night.png", {
        sliceX: 4,
        anims: {
            "normal": {
                from: 0,
                to: 3,
                speed: 3,
                frames: [0,1,2,3,2,1],
                loop: true,
            },
        },
    })

    k.loadSprite("smoke", "./graphics/smokeAnimation.png", {
        sliceX: 4,
        anims: {
            "normal": {
                from: 0,
                to: 3,
                speed: 3,
                frames: [0,1,2,3,2,1],
                loop: true,
            },
        },
    })

    k.loadSprite("crabpot", "./graphics/crabpot.png", {
        sliceX: 3,
        anims: {
            "idle": 0,
            "submerged": 1,
            "ready": 2,
        },
    })

    k.loadSprite("bird", "./graphics/bird.png", {
        sliceX: 3,
        anims: {
            "normal": {
                from: 0,
                to: 2,
                speed: 2,
                frames: [0,1,2,1,0],
                loop: true,
            },
        },
    })
    k.loadSprite("crab", "./graphics/crab.png", {
        sliceX: 3,
        anims: {
            "normal": {
                from: 0,
                to: 2,
                speed: 2,
                frames: [0,1,2,1,0],
                loop: true,
            },
        },
    })


    soundGen(soundsList)
    fishGen(fishesList)
    itemGen(itemsList)

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
function itemGen(list: string[]) {
    for (let asset of list) {
        loadItem(asset)
    }
}


function loadSound(name: string) {
    return k.loadSound(`${name}`,`./sounds/${name}.mp3`)
};
function loadFish(name: string) {
    return k.loadSprite(`${name}`,`./graphics/fishes/${name}.png`)
};
function loadItem(name: string) {
    return k.loadSprite(`${name}`,`./graphics/items/${name}.png`)
};



export function addSprite(name: string, ...components: Comp[]) {
    if (!k.getSprite(name)) {
        k.debug.log(`Sprite not loaded: ${name}`);
        throw new Error(`Sprite not loaded: ${name}`);
    }
    return k.add([k.sprite(name), ...components]);
};




export let soundsList = [
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
  "ale-locked",
  "ale",
  "alligatorgar-locked",
  "alligatorgar",
  "beardy-locked",
  "beardy",
  "blackbandedsunfish-locked",
  "blackbandedsunfish",
  "bleak-locked",
  "bleak",
  "bluefish",
  "bobo-locked",
  "bobo",
  "bowfin-locked",
  "bowfin",
  "bream-locked",
  "bream",
  "burbot-locked",
  "burbot",
  "carp-locked",
  "carp",
  "catfish-locked",
  "catfish",
  "crayfish-locked",
  "crayfish",
  "dragonfish-locked",
  "dragonfish",
  "eel-locked",
  "eel",
  "eidolon-locked",
  "eidolon",
  "emeralddreamer-locked",
  "emeralddreamer",
  "esox-locked",
  "esox",
  "fishbones-locked",
  "fishbones",
  "freshwatercrab-locked",
  "freshwatercrab",
  "freshwaterdrum-locked",
  "freshwaterdrum",
  "frogmouthcatfish-locked",
  "frogmouthcatfish",
  "ghostcarp-locked",
  "ghostcarp",
  "ghostknifefish-locked",
  "ghostknifefish",
  "gildedfish-locked",
  "gildedfish",
  "goliath-locked",
  "goliath",
  "hatchet-locked",
  "hatchet",
  "humpbackchub-locked",
  "humpbackchub",
  "largemouthbass-locked",
  "largemouthbass",
  "lordcray-locked",
  "lordcray",
  "oldboot-locked",
  "oldboot",
  "olly-locked",
  "olly",
  "orangefish",
  "orion-locked",
  "orion",
  "paddlefish-locked",
  "paddlefish",
  "perch-locked",
  "perch",
  "rudd-locked",
  "rudd",
  "shrimp-locked",
  "shrimp",
  "shyfish-locked",
  "shyfish",
  "slatefish-locked",
  "slatefish",
  "smallmouthbass-locked",
  "smallmouthbass",
  "spottedgar-locked",
  "spottedgar",
  "starbass-locked",
  "starbass",
  "tench-locked",
  "tench",
  "walleye-locked",
  "walleye",
  "yuppie-locked",
  "yuppie"
]


let itemsList = 
[
  "crabpot-icon",
  "boatkey",
  "beer",
  "birdfeed",
  "bugfeed",
  "cards",
  "coffee",
  "copperrod",
  "deluxebait",
  "dice",
  "elegantrod",
  "excellentrod",
  "exquisiterod",
  "fishfeedcan",
  "fishfeeddeluxe",
  "fishidentifier",
  "friedfish",
  "glasses",
  "grog",
  "legendaryrod",
  "pipe",
  "rancidgloop",
  "redrum",
  "woodrod",
  "attickey"
]