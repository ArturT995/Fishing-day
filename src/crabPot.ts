import { FISH_TIMER } from "./constants";
import { FISH_DATA } from "./db";
import gm from "./gm";
import k from "./kaplayCtx";
import { message } from "./messages";


export function makeCrabPot(posY: number, posX: number, name: string) {
    const pot = k.add([
            k.sprite("crabpot", { anim: "idle" }),
            k.pos(posY,posX),
            k.area(),
            k.z(2),
            k.state("idle", ["idle", "submerged", "ready"]),
        ]);
        
        const crabs = FISH_DATA.filter(fish => fish.feature === "Crabpot")
        const totalWeight = crabs.reduce((sum, crab) => sum + (1 / crab.rarityScore), 0);
        let chosenCrab = crabs[0]
        let roll = Math.random() * totalWeight
        for (const crab of crabs) {
            roll -= (1 / crab.rarityScore);
            if (roll <= 0) {
                chosenCrab = crab
                break
            }
        }

        pot.onStateEnter("idle", () => {
            pot.play("idle");
        });

        pot.onStateEnter("submerged", () => {
            pot.play("submerged");
        });

        pot.onStateEnter("ready", () => {
            pot.play("ready");
        });


        pot.onClick(() => {
            if (pot.state === "idle") {
                pot.enterState("submerged");
                if (name === "pot1") gm.isPotOneSubmerged = true
                if (name === "pot2") gm.isPotTwoSubmerged = true
            } else if (pot.state === "ready"){
                gm.addFish(chosenCrab.fishId);
                gm.unlockFish(chosenCrab.fishId);
                message(`You Caught: ${chosenCrab.name}`)
                pot.enterState("idle");
            }
        });

        let potTimer = FISH_TIMER/100 - gm.accumulatedTime/10
        pot.onUpdate(() => {
            if (gm.isPotOneSubmerged && name === "pot1") pot.enterState("submerged");
            if (gm.isPotTwoSubmerged && name === "pot2") pot.enterState("submerged");
            
            if (pot.state === "submerged") {
                if (gm.accumulatedTime > 0) {
                    potTimer -= gm.accumulatedTime/100
                    gm.accumulatedTime = 0;
                }  
                potTimer -= k.dt()
            }

            if (potTimer <= 0) {
                if (name === "pot1") gm.isPotOneSubmerged = false
                if (name === "pot2") gm.isPotTwoSubmerged = false
                pot.enterState("ready")
                message("Crabpot caught something.")
                potTimer = k.randi(FISH_TIMER/1.5,FISH_TIMER)/100
            }
        })
}