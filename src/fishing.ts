import type { Vec2 } from "kaplay";
import k from "./kaplayCtx";
import { COLORS } from "./constants";
import gm from "./gm";
import { play } from "./sounds";



export function throwLine(anchor: Vec2, power: number) {
    const existingBobber = k.get("bobber");
    if (existingBobber.length > 0) {
        return;
    }
    const mouseTarget = k.mousePos();
    const dir = mouseTarget.sub(anchor).unit();
    const landingPos = anchor.add(dir.scale(power * 50))

    const bobber = k.add([
        k.pos(anchor),
        k.circle(1),
        k.color(COLORS.RED),
        k.area(),
        k.z(5),
        k.anchor("center"),
        k.state("flying", ["flying","floating","reeling","splash","catching"]),
        {
                targetPos: landingPos,
                reelSpeed: gm.reelSpeed,
                catchArea: gm.catchArea,
                noticeArea: gm.noticeArea,
                fishPullDir: k.vec2(0,0),
                fishPullTime: 0,
                fishPullSpeed: 0,
        },
        "bobber"
    ])
    
    
    bobber.onStateEnter("flying", () => {
        
        k.tween(
            bobber.pos,
            bobber.targetPos,
            0.8,
            (p) =>  bobber.pos = p, k.easings.easeOutCubic
        ).then(() => bobber.enterState("splash"));
    });

    bobber.onStateEnter("splash", () => {
        k.play("fishing-thunk")
        spawnRipple(bobber.pos);
        bobber.enterState("floating");
    });

    bobber.onStateEnter("floating", () => {

        const noticeArea = bobber.add([
            k.circle(bobber.noticeArea, { fill: false }),
            k.opacity(0),
            k.outline(0.2, COLORS.BEIGE, 0.001),
            k.pos(),
            k.area(),
            "noticeArea"
        ])
        noticeArea.add([
            k.circle(1),
            k.opacity(0.03),
            k.color(COLORS.BLACK),
            k.anchor("center"),
            k.area(),
            "catchArea"
        ])
    });


    const reelingArea = k.add([
        k.circle(bobber.catchArea, { fill: false }),
        k.opacity(0),
        k.outline(0.2, COLORS.BEIGE, 0.1),
        k.pos(),
        k.area(),
        "reelingArea"
    ])



    bobber.onUpdate(() => {
        if (bobber.state === "floating") {
            if (gm.state === "catching") {
                bobber.enterState("catching")
            }
        }

        if (bobber.state === "reeling" && k.isMouseDown("right")) {

            const toAnchor = anchor.sub(bobber.pos).unit();
            bobber.move(toAnchor.scale(bobber.reelSpeed));
            if (gm.state === "catching") {
                bobber.enterState("catching")
            }
            if (bobber.pos.dist(anchor) < 10) {
                k.destroy(bobber);
            }
        }

        if (bobber.state === "catching") {
            const toAnchor = anchor.sub(bobber.pos).unit();
            reelingArea.pos = k.mousePos()
            reelingArea.opacity = 1;
            
            bobber.fishPullTime -= k.dt();
            if (bobber.fishPullTime <= 0) {
                const angle = k.rand(0, 360);
                bobber.fishPullDir = k.Vec2.fromAngle(angle);
                bobber.fishPullSpeed = k.rand(10, 25);
                bobber.fishPullTime = k.rand(0.5, 1);
            }

            bobber.move(bobber.fishPullDir.scale(bobber.fishPullSpeed));
            bobber.move(toAnchor.scale(-30)); 
            

            if (bobber.pos.dist(anchor) < 10) {
                const fishId = gm.currentFishId;

                if (gm.fishUnlocked.includes(fishId)) {
                    play("new-fish-caught", "sfx")
                } else {
                    play("fish-caught", "sfx")
                }

                gm.addFish(fishId);
                gm.unlockFish(fishId);

                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")

                
                return;
                //fish caught
            }
            if (bobber.pos.dist(anchor) > 200) {
                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")
                play("fish-escaped", "sfx")
                return;
                //fish escaped
            }

            if (k.isMouseDown("right")) {
                const isInside = bobber.pos.dist(reelingArea.pos) < reelingArea.radius;
                if (isInside) {
                    bobber.move(toAnchor.scale(bobber.reelSpeed*2));
                }
                bobber.move(toAnchor.scale(bobber.reelSpeed/4));
            }

        }
    })

    return bobber;
}


function spawnRipple(pos:Vec2) {
    const ripple = k.add([
        k.pos(pos),
        k.circle(2, { fill: false }),
        k.outline(0.5, COLORS.BLUE),
        k.opacity(0.3),
        k.lifespan(1, { fade: 0.3 }),
    ]);

    ripple.onUpdate(() => {
        ripple.radius += 0.2;
    });
}



