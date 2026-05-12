import { ITEM_DATA, ROD_DATA, type RodObj } from "./db";
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
    itemsOwned: string[];
    equippedRodId: string;
    currentFishId: string;
    currentFishDifficulty: number;
    currentFishSize: number;
    currentRodIcon: GameObj | null;
    settings: GameSettings;
    isPaused: boolean;
    logPopupOpen: boolean;
    intoxication: number;
    money: number;

    saveProgress(): void;

    unlockFish(fishId: string): void;
    addFish(fishId: string): void;
    removeFish(fishId: string): void;

    unlockItem(itemId: string): void;
    addItem(itemId: string): void;
    removeItem(itemId: string): void;

    addMoney(number:number): void;
    removeMoney(number:number): void;

    updateVolume(type: "music" | "sfx", val: number): void;
    equipRod(rodId:string): void;
    resetGameState(): void;
}

function makeGameManager() {

    const savedUnlocks = k.getData("fishUnlocked", [] as string[]);
    const savedCaught = k.getData("fishCaught", [] as string[]);
    const savedItems = k.getData("itemsUnlocked", [] as string[]);
    const savedOwned = k.getData("itemsOwned", [] as string[]);
    const savedMoney = k.getData<number>("money", 0);
    const savedRodId = k.getData<string>("rodEquippedId");
    
    const settings = { 
        musicVolume: 0.5, 
        sfxVolume: 1,
    };

    const currentRod = ROD_DATA.find((rod: RodObj) => rod.rodId === savedRodId) as RodObj;

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
            itemsOwned: savedOwned,
            settings: settings,
            money: savedMoney,
            equippedRodId: savedRodId,

            saveProgress(this: GameManager) {
                k.setData("fishUnlocked", this.fishUnlocked);
                k.setData("fishCaught", this.fishCaught);
                k.setData("itemsUnlocked", this.itemsUnlocked);
                k.setData("itemsOwned", this.itemsOwned);
                k.setData("money", this.money);
                k.setData("rodEquippedId", this.equippedRodId);
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
            removeFish(this: GameManager, fishId: string) {
                const index = this.fishCaught.indexOf(fishId)
                if (index !== -1) {
                    this.fishCaught.splice(index, 1);
                    this.saveProgress();
                }
                
            },

            unlockItem(this: GameManager, itemId: string) {
                if (!this.itemsUnlocked.includes(itemId)) {
                    this.itemsUnlocked.push(itemId);
                    this.saveProgress();
                }
            },
            addItem(this: GameManager, itemId: string) {
                this.itemsOwned.push(itemId);
                this.saveProgress();
            },
            removeItem(this: GameManager, itemId: string) {
                const index = this.itemsOwned.indexOf(itemId)
                if (index !== -1) {
                    this.itemsOwned.splice(index, 1);
                    this.saveProgress();
                }
            },


            addMoney(this: GameManager, number: number) {
                this.money += number;
                this.saveProgress();
            },
            removeMoney(this: GameManager, number: number) {
                this.money -= number;
                this.saveProgress();
            },


            updateVolume(this: GameManager, type: "music" | "sfx", val: number) {
                if (type === "music") this.settings.musicVolume = val;
                if (type === "sfx") this.settings.sfxVolume = val;
                this.saveProgress();
            },

            
            equipRod(this: GameManager, rodId: string) {
                this.equippedRodId = rodId;
                const rodData = ROD_DATA.find(rod => rod.rodId === rodId) as RodObj;
                if (rodData) {
                    this.reelSpeed = rodData.reelSpeed as number;
                    this.catchArea = rodData.catchArea as number;
                    this.endurance = rodData.endurance as number;
                }
                this.saveProgress();
            },


            isPaused: false,
            logPopupOpen: false,
            intoxication: 0,
            currentFishId: "",
            currentFishDifficulty: 0,
            currentFishSize: 0,

            noticeArea: currentRod.catchArea + 15,

            // rod stats
            currentRodIcon: null,

            reelSpeed: currentRod.reelSpeed as number,
            catchArea: currentRod.catchArea as number,
            endurance: currentRod.endurance as number,

            resetGameState(this:GameObj) {
                this.isPaused = false;
                this.logPopupOpen = false;
                this.intoxication = 0;
                this.currentFishDifficulty = 0;
                this.currentFishId = "";
            },
       },

    ]) as GameManager;
}

const gm = makeGameManager();

export default gm;





