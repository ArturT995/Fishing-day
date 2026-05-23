import { FISH_TIMER } from "./constants";
import { FISH_DATA } from "./db";
import gm from "./gm";
import k from "./kaplayCtx";
import { message } from "./messages";


export function makeCrabPot(posY: number, posX: number) {
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
            } else if (pot.state === "ready"){
                gm.addFish(chosenCrab.fishId);
                gm.unlockFish(chosenCrab.fishId);
                message(`You Caught: ${chosenCrab.name}`)
                pot.enterState("idle");
            }
        });

        let potTimer = k.randi(FISH_TIMER/1.5,FISH_TIMER)
        pot.onUpdate(() => {
            if (pot.state === "submerged") {
                potTimer -= 1
            }

            if (potTimer <= 0) {
                pot.enterState("ready")
                potTimer = k.randi(FISH_TIMER/1.5,FISH_TIMER)
            }
        })
}