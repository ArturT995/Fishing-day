import type { GameObj } from "kaplay";
import k from "./kaplayCtx";
import type { FishObj } from "./entities/fishes";



function makeGameManager() {
    return k.add([
        k.state("menu", [
            "intro",
            "level-intro-morning",
            "fishing",
            "catching",
            "fish-caught",
            "shop",
        ]),
       {
            isPaused: false,
            logPopupOpen: false,
            fishCaught: [] as FishObj[],

            resetGameState(this:GameObj) {
                this.isPaused = false;
                this.logPopupOpen = false;
                this.fishCaught = [];
            },
       },

    ]);
}

const gm = makeGameManager();
export default gm;
