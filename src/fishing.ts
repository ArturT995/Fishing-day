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
    let baitPower = 0;
    if (gm.baitPower >= 5) {
        baitPower = 5;
        gm.baitPower -= 1;
    }
    

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
                reelSpeed: gm.reelSpeed + baitPower*3,
                catchArea: gm.catchArea,
                noticeArea: gm.noticeArea + baitPower,
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
        playSound("fishing-thunk", "sfx")
        spawnRipple(bobber.pos);
        bobber.enterState("floating");
    });

    bobber.onStateEnter("floating", () => {

        const noticeArea = bobber.add([
            k.circle(bobber.noticeArea, { fill: false }),
            k.opacity(0),
            k.outline(0.2, COLORS.BEIGE, 0.001),
            k.anchor("center"),
            k.pos(0,0),
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

    const reelSound = k.play("icon-sound-1", { volume: 1.0, loop: true, detune: 3200, speed: 12 });
    reelSound.volume = 0;

    if (gm.debug === true) {
        k.onKeyPress("1", () => {
            reelingArea.opacity = 0.5
            if (!bobber.noticeArea) return;
            bobber.noticeArea.opacity = 0.5
        })
    }

    bobber.onUpdate(() => {

        const toAnchor = anchor.sub(bobber.pos).unit();

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

        // difficulty modifications here
        if (bobber.state === "catching") {
            catchTime -= 0.02
            reelingArea.pos = k.mousePos()
            reelingArea.opacity = 1;
            reelSound.volume = 1;
            
            const fishId = gm.currentFishId;
            //const size = gm.currentFishSize;
            const difficulty = gm.currentFishDifficulty/2;


            bobber.fishPullTime -= k.dt();
            const maxFishDifficulty = 32;
            if (bobber.fishPullTime <= 0) {
                bobber.fishPullTime = 3 + ((maxFishDifficulty - (gm.currentFishDifficulty + 3)) / 10);
                const angle = k.rand(130, 300);
                bobber.fishPullDir = k.Vec2.fromAngle(angle);
                bobber.fishPullSpeed = k.rand(10+difficulty*3, 25+difficulty*6);
            }

            // set to 2 to allow a refresh period between movements
            if (bobber.fishPullTime >= 2) {
                bobber.move(bobber.fishPullDir.scale(bobber.fishPullSpeed));
                //bounce
                if (!fishingArea.hasPoint(bobber.pos) && !rodArea.hasPoint(bobber.pos)) {
                    playSound("fishing-thunk", "sfx");
                    spawnRipple(bobber.pos)
                    mvTime = 10;
                }
                if (mvTime > 0) {
                    mvTime -= 0.2
                    const toCenter = center.sub(bobber.pos).unit();
                    bobber.move(toCenter.scale(k.randi(80, 140)));
                    if (!fishingArea.hasPoint(bobber.pos)) bobber.move(toCenter.scale(k.randi(50)));
                }
            }

            // constantly moves away from bobber at all times
            bobber.move(toAnchor.scale(-30 - difficulty));


            // catch
            if (bobber.pos.dist(anchor) < 15) {
                catchingFlag = false
                const fish = FISH_DATA.find(fish=> fish.fishId === fishId)
                if (fish === undefined) throw new Error("Fish undefined")
                
                reelSound.volume = 0;
                reelSound.stop();
                
                if (!gm.fishUnlocked.includes(fishId)) {
                    playSound("fish-caught", "sfx") //normal sounds better here
                } else {
                    if (fish.feature === "Grunting") playSound("thumping", "sfx", 3, false, -2000, 2)
                    else playSound("new-fish-caught", "sfx")
                }

                gm.addFish(fishId);
                gm.unlockFish(fishId);
                gm.removeFishFromPool(fishId)

                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")
                message(`You caught: ${fish.name}`)
                return;
            }

            //escape
            if (bobber.pos.dist(anchor) > k.height() - 50 || catchTime <= 0 ||
            (!fishingArea.hasPoint(bobber.pos) && bobber.pos.dist(anchor) > 160 )) {
                catchingFlag = false
                k.destroy(bobber);
                k.destroy(reelingArea);
                gm.currentFishId = "";
                gm.enterState("fishing")
                playSound("fish-escaped", "sfx")
                message(". . .")
                catchTime = gm.endurance
                reelSound.volume = 0;
                reelSound.stop();
                return;
            }

            // resist

            const isInside = bobber.pos.dist(reelingArea.pos) < reelingArea.radius;
            if (isInside) {   
                const isResisting = k.chance(difficulty / 100);
                reelSound.volume = 2;

                if (isResisting) {
                    bobber.move(toAnchor.scale(bobber.reelSpeed - gm.currentFishDifficulty*2));
                } else {
                    bobber.move(toAnchor.scale(bobber.reelSpeed - gm.currentFishDifficulty));
                }
            }

            //bounce
            if (!fishingArea.hasPoint(bobber.pos) && !rodArea.hasPoint(bobber.pos)) {
                mvTime = 10;
            }


            if (mvTime > 0) {
                mvTime -= 0.2
                if (mvTime === 2) {
                    playSound("fishing-thunk", "sfx");
                    spawnRipple(bobber.pos)
                }
                const toCenter = center.sub(bobber.pos).unit();
                bobber.move(toCenter.scale(k.randi(40, 70)));
                if (!fishingArea.hasPoint(bobber.pos)) bobber.move(toCenter.scale(50));
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

