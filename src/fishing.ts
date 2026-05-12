import type { Vec2 } from "kaplay";
import k from "./kaplayCtx";
import { COLORS, fishingArea, rodArea } from "./constants";
import gm from "./gm";
import { playSound } from "./sounds";
import { message } from "./messages";
import { FISH_DATA } from "./db";



export function throwLine(anchor: Vec2, power: number) {
    const existingBobber = k.get("bobber");
    if (existingBobber.length > 0) {
        return;
    }

    const mouseTarget = k.mousePos();
    const dir = mouseTarget.sub(anchor).unit();
    const landingPos = anchor.add(dir.scale(power * 50));
    let random = k.randi(15,45)
    let mvTime = 0;

    const centerX = k.randi(k.width()/2 - random, k.width()/2 + random)
    const centerY = k.randi(k.height()/2 - random, k.height()/2 + random)
    let center = k.vec2(centerX, centerY);

    let catchTime = gm.endurance;
    
    

    const bobber = k.add([
        k.pos(anchor),
        k.circle(1),
        k.color(COLORS.RED),
        k.area(),
        k.z(9),
        k.anchor("center"),
        k.opacity(1),
        k.scale(1),
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

    let catchingFlag = false;
    bobber.onStateEnter("catching", () => {
        if (catchingFlag) return;
        catchingFlag = true;
        bobber.reelSpeed = bobber.reelSpeed - gm.currentFishDifficulty/2
    })

    bobber.onUpdate(() => {

        const toAnchor = anchor.sub(bobber.pos).unit();
        const escapeDir = k.vec2(-toAnchor.y, toAnchor.x);

        if (bobber.state === "floating") {
            if (gm.state === "catching") {
                bobber.enterState("catching")
            }
        }

        if (bobber.state === "reeling" && k.isMouseDown("right")) {

            
            bobber.move(toAnchor.scale(bobber.reelSpeed));
            if (gm.state === "catching") {
                bobber.enterState("catching")
            }
            if (bobber.pos.dist(anchor) < 10) {
                k.destroy(bobber);
            }
        }

        if (bobber.state === "catching") {
            catchTime -= 0.02
            reelingArea.pos = k.mousePos()
            reelingArea.opacity = 1;
            
            const fishId = gm.currentFishId;
            const size = gm.currentFishSize;
            const difficulty = gm.currentFishDifficulty/2;
            const timeModifier = difficulty / 100


            bobber.fishPullTime -= k.dt();

            if (bobber.fishPullTime <= 0) {
                const angle = k.rand(0, 360);
                bobber.fishPullDir = k.Vec2.fromAngle(angle);
                bobber.fishPullSpeed = k.rand(10+difficulty*5, 25+difficulty*10);
                bobber.fishPullTime = k.rand(0.5-timeModifier, 1-timeModifier);
            }

            bobber.move(bobber.fishPullDir.scale(bobber.fishPullSpeed));
            bobber.move(toAnchor.scale(-30)); 
            

            // catch
            if (bobber.pos.dist(anchor) < 15) {
                catchingFlag = false

                if (gm.fishUnlocked.includes(fishId)) {
                    playSound("new-fish-caught", "sfx")
                } else {
                    playSound("fish-caught", "sfx")
                }

                gm.addFish(fishId);
                gm.unlockFish(fishId);

                const fish = FISH_DATA.find(fish=> fish.fishId === fishId)
                if (fish === undefined) throw new Error("Fish undefined")

                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")
                message(`You caught: ${fish.name}`)
                return;
            }

            //escape
            if (bobber.pos.dist(anchor) > 190 || catchTime <= 0 ||
            (!fishingArea.hasPoint(bobber.pos) && bobber.pos.dist(anchor) > 160 )) {
                catchingFlag = false
                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")
                playSound("fish-escaped", "sfx")
                message(". . .")
                catchTime = gm.endurance
                return;
            }

            //bounce
            // TODO: Add a sound for bouncing and maybe some effect/splash too.
            if (!fishingArea.hasPoint(bobber.pos) && !rodArea.hasPoint(bobber.pos)) {
                playSound("fishing-thunk", "sfx");
                spawnRipple(bobber.pos)
                mvTime = 10;
            }
            if (mvTime > 0) {
                mvTime -= 0.2
                const toCenter = center.sub(bobber.pos).unit();
                bobber.move(toCenter.scale(k.randi(80, 160)));
                if (!fishingArea.hasPoint(bobber.pos)) bobber.move(toCenter.scale(k.randi(100)));
            }


            const isInside = bobber.pos.dist(reelingArea.pos) < reelingArea.radius;
            if (isInside) {   
                const isResisting = k.chance(difficulty / 200);

                if (!isResisting) {
                    bobber.move(toAnchor.scale(bobber.reelSpeed));
                } else {
                    const escapeSpeed = difficulty * 10
                    bobber.move(escapeDir.scale(escapeSpeed * k.choose([1, -1])));
                }

                if (isResisting) {
                    const shakePower = 2;
                    bobber.move(k.vec2(k.rand(-1, 1), k.rand(-1, 1)).scale(shakePower * 100));
                    bobber.opacity = k.wave(0.5, 1, k.time() * 20);
                    const pulse = 1 + Math.sin(k.time() * 25) * 0.2;
                    bobber.scale = k.vec2(pulse);
                } else {
                    bobber.opacity = 1;
                    bobber.scale = k.vec2(1);
                }
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

