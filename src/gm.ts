import k from "./kaplayCtx";
import type { GameObj } from "kaplay";
import type { FishObj } from "./db";



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
            fishReelSpeed: 0,
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

function makeRodManager() {
    return k.add([
        k.state("woodRod")
    ])
}



/*
Wood rod - A basic rod, enough to get the job done.
Copper Rod - An improved rod, it is easier to handle.
Elegant Rod - A graceful rod, it is lighter and feels comfortable in your hands.
Exquisite Rod - Quite a feat of craftsmanship. It has a great grip, weight and handles well.
Excellent Rod - This rod feels perfect! You didn't think rods could be done at such a level.
(unlock at buying excellent and some other tasks)
Legendary Rod - Tales have been told of an ancient ornate rod that can tame the mightiest of fish. To see it in person fills you with awe. You feel a strange tingling when you hold it.
*/