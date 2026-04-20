import k from "./kaplayCtx";
import type { GameObj } from "kaplay";


type GameSettings = {
    musicVolume: number;
    sfxVolume: number;
};

interface GameManager extends GameObj {
    fishUnlocked: string[];
    fishCaught: string[];
    itemsUnlocked: string[];
    currentFishId: string;
    settings: GameSettings;
    isPaused: boolean;
    logPopupOpen: boolean;

    saveProgress(): void;
    unlockFish(fishId: string): void;
    addFish(fishId: string): void;
    resetGameState(): void;
}

function makeGameManager() {

    const savedUnlocks = k.getData("fishUnlocked", [] as string[]);
    const savedCaught = k.getData("fishCaught", [] as string[]);
    const savedItems = k.getData("itemsUnlocked", [] as string[])
    
    const savedSettings = k.getData("settings", { 
        musicVolume: 1, 
        sfxVolume: 1
    } as GameSettings);

    return k.add([
        k.state("menu", [
            "intro",
            "fishing",
            "catching",
            "fish-caught",
            "shop",
        ]),
       {
            fishUnlocked: savedUnlocks,
            fishCaught: savedCaught,
            itemsUnlocked: savedItems,
            settings: savedSettings,
            currentFishId: "",

            saveProgress(this: GameManager) {
                k.setData("fishUnlocked", this.fishUnlocked);
                k.setData("fishCaught", this.fishCaught);
                k.setData("itemsUnlocked", this.itemsUnlocked);
                k.setData("settings", this.settings);
            },

            unlockFish(this: GameManager, fishId: string) {
                if (!this.fishUnlocked.includes(fishId)) {
                    this.fishUnlocked.push(fishId);
                    this.saveProgress();
                }
                
            },

            addFish(this: GameManager, fishId: string) {
                this.fishCaught.push(fishId);
                this.saveProgress();
            },

            unlockItem(this: GameManager, itemId: string) {
                if (!this.itemsUnlocked.includes(itemId)) {
                    this.itemsUnlocked.push(itemId);
                    this.saveProgress();
                }
            },

            updateVolume(this: GameManager, type: "music" | "sfx", val: number) {
                if (type === "music") this.settings.musicVolume = val;
                if (type === "sfx") this.settings.sfxVolume = val;
                this.saveProgress();
            },

            isPaused: false,
            logPopupOpen: false,
            fishReelSpeed: 0,

            resetGameState(this:GameObj) {
                this.isPaused = false;
                this.logPopupOpen = false;
            },
       },

    ]) as GameManager;
}

const gm = makeGameManager();

export default gm;





