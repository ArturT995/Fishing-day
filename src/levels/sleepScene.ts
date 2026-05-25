import { COLORS, fontConfig } from "../constants";
import gm from "../gm";
import k from "../kaplayCtx";
import { playSound } from "../sounds";


export function sleepScene() {
    // reset flags
    gm.logPopupOpen = false;
    

    k.scene("sleep-scene", async () => {
        k.setCursor("none");

        k.add([
            k.rect(k.height(), k.width()),
            k.pos(k.center()),
            k.anchor("center"),
            k.color(COLORS.DARKBLUE),
            k.z(1)
        ])
        playSound("thumping", "sfx")
        await k.wait(1)
        k.add([
            k.text("You head to sleep in the shop attic", fontConfig),
            k.color(COLORS.ORANGE),
            k.pos(k.center()),
            k.anchor("center"),
            k.z(2)
        ])
        playSound("shaking", "sfx")
        await k.wait(2)
        let dreamText = k.choose(["dogs", "cats", "turtles", "fish", "The Shopkeeper", "a mermaid", "bugs", "the Sea", "the Depths", "a forest", "a field with stormclouds", "nothing", "eating", "being young again", "falling"])
        k.add([
            k.text(`You dream of ${dreamText}`, fontConfig),
            k.color(COLORS.ORANGE),
            k.pos(k.width()/2, k.height()/2 + 20),
            k.anchor("center"),
            k.z(3)
        ])
        playSound("thumping", "sfx")
        await k.wait(3)

        k.go("main-menu")
    })
}