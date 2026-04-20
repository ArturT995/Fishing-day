import type { AudioPlay } from "kaplay"
import k from "./kaplayCtx"
import gm from "./gm"




export const menuMusic = ["menu-bg-1", "day-bg-4", "night-menu-1"]
export const dayMusic = ["day-bg-3", "fishing-bg-1", "fishing-bg-2", "fishing-bg-3"]
export const ambientSounds = ["sea", "wind"]
export const shopMusic = ["day-bg-3", "night-shop-1"]
export const nightMusic = ["night-bg-1", "night-bg-2"]
export const eventMusic = ["boss1", "fast-tune"]

export const uiSfx = ["icon-sound-1", "icon-sound-2", "item-bought"]
export const daySfx = ["bird1", "bird2", "bird3", "day-bird-2", "day-bird-3"]
export const nightSfx = ["night-bird-1", "night-bird-2", "night-bird-3", "night-bird-4", 
    "night-bug-1", "night-bug-2"]
export const creatureSfx = ["chomps", "crabclack", "fly", "frog-1", "frog-2",
    "laughing-bird", "mosquito", "thumping", "shaking"]


/*
for reference

const eventSfx = ["new-fish-caught", "new-fish-unlocked", "fish-caught", 
    "fish-escaped", "fishing-thunk", "flying-2", "powerbar", "powerup", 
    "rare-catch", "rare-sell", "sell-item"]

const itemSfx = ["chomps", "cards", "dice-roll", "drinking-noise", 
    "pipe", "rancid-gloop", "shaking"]
*/

export let sfxSet = new Set<AudioPlay>();
export let musicSet = new Set<AudioPlay>();

export function play(sound: string, type: "sfx" | "music" , volumeAdd = 0, 
    loop = false, detune = 0, speed = 1) {
    

    if (gm.settings.musicVolume === 0 && type === "music") {
        volumeAdd = 0;
    }
    if (gm.settings.sfxVolume === 0 && type === "sfx") {
        volumeAdd = 0;
    }

    let song = k.play(sound, {
        volume: gm.settings.musicVolume + volumeAdd,
        loop: loop,
        detune: detune,
        speed: speed,
    })
    if (type === "music") {
        musicSet.add(song)
        song.onEnd(() => musicSet.delete(song))
    } else {
        sfxSet.add(song)
        song.onEnd(() => sfxSet.delete(song))
    }
    
    return song;
}
