import type { AudioPlay } from "kaplay"
import k from "./kaplayCtx"
import gm from "./gm"
import { soundsList } from "./assetLoader"



/*
export const menuMusic = ["menu-bg-1", "day-bg-4", "night-menu-1"]
export const dayMusic = ["day-bg-3", "fishing-bg-1", "fishing-bg-2", "fishing-bg-3"]
export const ambientSounds = ["sea", "wind"]
export const shopMusic = ["day-bg-3", "night-shop-1"]
export const nightMusic = ["night-bg-1", "night-bg-2"]
export const eventMusic = ["boss1", "fast-tune"]

export const uiSfx = ["icon-sound-1", "icon-sound-2", "item-bought", "sell-item", "rare-sell"]
export const daySfx = ["bird1", "bird2", "bird3", "day-bird-2", "day-bird-3"]
export const nightSfx = ["night-bird-1", "night-bird-2", "night-bird-3", "night-bird-4", 
    "night-bug-1", "night-bug-2"]
export const creatureSfx = ["chomps", "crabclack", "fly", "frog-1", "frog-2",
    "laughing-bird", "mosquito", "thumping", "shaking"]

/*
    const eventSfx = ["new-fish-caught", "new-fish-unlocked", "fish-caught", 
        "fish-escaped", "fishing-thunk", "flying-2", "powerbar", "powerup", 
        "rare-catch"]

    const itemSfx = ["chomps", "cards", "dice-roll", "drinking-noise", 
        "pipe", "rancid-gloop", "shaking"]
   const transferSfx = ["cards", "pipe", "drinking-noise", "frog-1", "frog-2", "bird1", "bird2",]
*/


export let sfxSet = new Map<AudioPlay, number>();
export let musicSet = new Map<AudioPlay, number>();


export function playSound(sound: string, type: "sfx" | "music" , volumeAdd = 0, 
    loop = false, detune = 0, speed = 1) {
    
    if (!soundsList.includes(sound)) throw new Error(`Sound "${sound}" not found in soundsList`)

    if (type === "music") {
        musicSet.forEach((_, song) => {
            musicSet.delete(song);
        })
    }

    if (type === "sfx" && sfxSet.size > 10) {
        sfxSet.forEach((_, sfx) => {
            sfxSet.delete(sfx);
        })
    }

    if (gm.settings.musicVolume === 0 && type === "music") {
        volumeAdd = 0;
    }
    if (gm.settings.sfxVolume === 0 && type === "sfx") {
        volumeAdd = 0;
    }

    let soundObj: AudioPlay
    let soundTypeVolume = (type === "music") ? gm.settings.musicVolume : gm.settings.sfxVolume;
    
    soundObj = k.play(sound, {
        volume: soundTypeVolume + volumeAdd,
        loop: loop,
        detune: detune,
        speed: speed,
    })
    
    if (type === "music") {
        musicSet.set(soundObj, volumeAdd);
        soundObj.onEnd(() => musicSet.delete(soundObj));
    } else {
        sfxSet.set(soundObj, volumeAdd)
        soundObj.onEnd(() => sfxSet.delete(soundObj))
    }
    
    return soundObj;

}

const transferSfx = ["cards", "pipe", "drinking-noise", "frog-1", "frog-2", "bird1", "bird2",]
export function playNextSong(songs: string[], index: number) {

    const track = songs[index];
    index = (index + 1) % songs.length;
    let bgMusic = playSound(track, "music", -0.1, false);

    bgMusic.onEnd(() => {
        let sfx = playSound(transferSfx[k.randi(0,transferSfx.length)], "sfx", -0.3, false);
        sfx.onEnd(() => {
            playNextSong(songs, index);
        })
    });

    return bgMusic;
}
