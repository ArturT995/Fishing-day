import { COLORS, fontConfig } from "../constants";
import gm from "../gm";
import k from "../kaplayCtx";
import { playSound } from "../sounds";


export function endScene() {

    gm.logPopupOpen = false;
    

    k.scene("end-scene", async () => {
        k.setCursor("none");

        k.add([
            k.rect(k.width(), k.height() ),
            k.pos(k.center()),
            k.anchor("center"),
            k.color(COLORS.DARKBLUE),
            k.z(1)
        ])

        // ending sprite
        k.add([
            k.sprite("endscene"),
            k.pos(k.width()/2, 55),
            k.anchor("center"),
            k.z(2)
        ])
        let sea = playSound("sea", "music", -0.8 ,true)
        playSound("shaking", "sfx")
        await k.wait(1)
        k.add([
            k.text("You head out towards the sea on your new boat.", fontConfig),
            k.color(COLORS.ORANGE),
            k.pos(k.width()/2, k.height()/2 + 20),
            k.anchor("center"),
            k.z(2)
        ])

        await k.wait(3)
        let seaText = k.choose(["North", "South", "East", "West", "to The Archipelago", "towards The Depths", "to the Emerald Isles", "to seek bigger fish", "to Stormy Isles"])
        k.add([
            k.text(`You go ${seaText}`, fontConfig),
            k.color(COLORS.ORANGE),
            k.pos(k.width()/2, k.height()/2 + 40),
            k.anchor("center"),
            k.z(3)
        ])
        playSound("shaking", "sfx")
        await k.wait(5)
        playSound("new-fish-unlocked", "sfx")
        k.add([
            k.text("Thank you for playing!", fontConfig),
            k.color(COLORS.GREEN),
            k.pos(k.width()/2, k.height()/2 + 80),
            k.anchor("center"),
            k.z(2)
        ])
        await k.wait(5)
        k.go("main-menu")
        k.onSceneLeave(() => {
            sea.stop()
        })
    })
}