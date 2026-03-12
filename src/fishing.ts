import type { GameObj, Vec2 } from "kaplay";
import { fishingPool, FISH_DATA, type FishObj, FISH_AMOUNT } from "./entities/fishes";
import k from "./kaplayCtx";
import { COLORS, fishingArea, type Stats } from "./constants";



export function generateFishes() {
    let fishes = fishingPool(FISH_DATA, FISH_AMOUNT)
    for (let fish of fishes) {
        let randomPos = k.vec2(
            k.randi(12, 240),
            k.randi(12, 170)
        );
        if (!fishingArea.hasPoint(randomPos)) {
            randomPos = k.vec2(k.randi(70,150), k.randi(60,130))
        }
        makeFish(fish, randomPos)
    }
}

export function makeFish(fish: FishObj, pos: Vec2) {
    const size = (k.randi(1, 1.4)*fish.size) / 5
    const speed = k.rand(1, 5)
    const sizeSprite = k.rect(size*2,size, {radius: 3})
    const r = 50;

    const fishColors = [COLORS.GRAYBLUE,COLORS.DARKGRAYBLUE];
    const randomColor = k.choose(fishColors);

    const entity = k.add([
        k.pos(pos),
        sizeSprite,
        k.opacity(1), //debug, change to 0
        k.anchor("center"),
        k.area(),
        k.color(randomColor),
        k.rotate(0),
        k.state("idle", ["idle", "notice", "move", "pursue","hooked","attack"]),
        {   
            name: fish.name,
            speed: speed,
            size: fish.size,
            hooked: false,
            difficulty: fish.difficulty,
            waypoints: [
                pos.add(k.vec2(k.rand(-r, r), k.rand(-r, r))),
                pos.add(k.vec2(k.rand(-r, r), k.rand(-r, r))),
                pos.add(k.vec2(k.rand(-r, r), k.rand(-r, r))),
                pos.add(k.vec2(k.rand(-r, r), k.rand(-r, r))),
                pos.add(k.vec2(k.rand(-r, r), k.rand(-r, r))),
            ],
            currentWaypoint: 0
        },
        "fish",
    ]);
    
    /* disable in debug
    const delay = k.rand(1, 8);

    k.wait(delay, () => {
        entity.opacity = k.rand(0.4, 0.7);

        entity.fadeIn(k.rand(5, 18));
    });
    */

    entity.onStateEnter("idle", async () => {
        await k.wait(k.rand(0.2, 1))
        entity.enterState("move");
    })

    entity.onKeyPress("k", () => {
        entity.enterState("attack");
    });

    entity.onStateEnter("attack", async () => {
        const bobber = k.get("bobber")[0];
        const dir = bobber.pos.sub(entity.pos).unit();
        await k.wait(k.rand(0,1));
        k.add([
            k.pos(entity.pos),
            k.move(dir, 30),
            k.circle(1),
            k.area(),
            k.offscreen({ destroy: true }),
            k.anchor("center"),
            k.color(COLORS.WHITE),
            "bullet",
        ]);
        
        bobber.onCollide("bullet", (bullet: GameObj) => {
            k.play("thunk", {volume: 0.2})
            k.destroy(bullet);
        });
        await k.wait(1);
        entity.enterState("idle");
    })


    entity.onUpdate(() => {

        if (!fishingArea.hasPoint(entity.pos)) {
            const safePoint = k.vec2(k.randi(70,150), k.randi(60,130)); 
            if (entity.waypoints[entity.currentWaypoint].dist(safePoint) > 1) {
            entity.waypoints[entity.currentWaypoint] = safePoint;
            entity.enterState("move");
            }
        }

        if (entity.state === "move") {
            const target = entity.waypoints[entity.currentWaypoint];
            const dir = target.sub(entity.pos).unit();
            entity.move(dir.scale(entity.speed));
            entity.angle = dir.angle();

            if (entity.pos.dist(target) < 5) {
                entity.currentWaypoint = (entity.currentWaypoint + 1) % entity.waypoints.length;
                entity.enterState("idle");
            }
        
            if (entity.state === "move" && k.chance(0.01)) {
                k.add([
                    k.pos(entity.pos),
                    k.circle(k.rand(0.2, 1)),
                    k.color(COLORS.BLUE),
                    k.opacity(0.2),
                    k.lifespan(1, { fade: 0.5 }),
                ]);
            }
        }
        if (entity.state === "pursue") {
            const bobber = k.get("bobber")[0];
            if (!bobber) {
                entity.enterState("idle");
            } else {
                const dir = bobber.pos.sub(entity.pos).unit();
                entity.angle = dir.angle();
                entity.move(dir.scale(entity.speed * 1.5));
            }
        }
        if (entity.state === "hooked") {
            const bobber = k.get("bobber")[0];
            if (!bobber) {
                entity.enterState("idle");
            } else {
                entity.use(k.follow(bobber, k.vec2(0, 0)));
            }
        }
    })
    entity.onCollide("noticeArea", () => {
        if (entity.state !== "idle" && entity.state !== "move" ) return
        entity.enterState("notice")
    })

    
    entity.onCollide("catchArea", () => {
        k.play("icon",{volume: 0.2}) //placeholder
        const stats: Stats = { 
            size: entity.size, 
            difficulty: entity.difficulty,
            name: entity.name,
            pos: entity.pos 
        };
        spawnCaughtFish(stats);
        entity.destroy();
        
    })

    entity.onStateEnter("hooked", () => {
        const bobber = k.get("bobber")[0];
        bobber.reelspeed -= entity.size * 2
        if (!bobber){
            entity.enterState("idle");
        }
    })


    entity.onStateEnter("notice", async () => {
        k.play("icon",{volume: 0.03})
        const notice = entity.add([
            k.circle(0.5),
            k.color(COLORS.BEIGE)
        ])
        await k.wait(k.rand(1, 2))
        k.destroy(notice)
        entity.enterState("pursue");
    })
}






function spawnCaughtFish(fish: Stats) {
    const bobber = k.get("bobber")[0];
    if (!bobber) return;

    const size = fish.size / 5
    const sizeSprite = k.rect(size*2,size, {radius: 3})
    const caughtFish = bobber.add([
        k.pos(0,-3),
        sizeSprite,
        k.anchor("center"),
        k.area(),
        k.z(-2),
        k.color(COLORS.BLACK),
        k.rotate(90),
        {   
            name: fish.name,
            size: fish.size,
            difficulty: fish.difficulty,
        },
        "caughtFish",
    ]);


    caughtFish.onUpdate(() => {
        caughtFish.angle = k.rand(60, 120);
    });
}







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
        k.state("flying", ["flying","floating","reeling","splash"]),
        {
                targetPos: landingPos,
                reelSpeed: 50,
        },
        "bobber"
    ])
    const flySound = k.play("icon2", { volume: 1.0, loop: true, detune: 3200, speed: 16 });
    flySound.volume = 0;
    
    bobber.onStateEnter("flying", () => {
        
        k.tween(
            bobber.pos,
            bobber.targetPos,
            0.8,
            (p) =>  bobber.pos = p, k.easings.easeOutCubic
        ).then(() => bobber.enterState("splash"));
    });

    bobber.onStateEnter("splash", () => {
        k.play("thunk")
        spawnRipple(bobber.pos);

        bobber.enterState("floating");
    });

    bobber.onStateEnter("floating", () => {

        //reuse area in fish catch minigame
        const noticeArea = bobber.add([
            k.circle(15, { fill: false }),
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


    bobber.onUpdate(() => {
        if (bobber.state === "flying") flySound.volume = 2;
        if (bobber.state === "floating") flySound.volume = 0;

        if (bobber.state === "reeling" && k.isMouseDown("right")) {
            flySound.volume = 0;
            const toAnchor = anchor.sub(bobber.pos).unit();
            bobber.move(toAnchor.scale(bobber.reelSpeed));

            if (bobber.pos.dist(anchor) < 10) {
                k.destroy(bobber);
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



