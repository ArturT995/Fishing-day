import type { Vec2, GameObj } from "kaplay";
import { COLORS, FISH_AMOUNT, fishingArea } from "../constants";
import gm from "../gm";
import k from "../kaplayCtx";
import { type FishObj, FISH_DATA } from "../db";



export const ANCHOR = k.vec2(k.width() / 2, k.height() - 12)

//make this a set for quicker lookups and no duplicates
//change difficulty into a number



export function fishingPool(FISH_DATA: FishObj[], poolSize: number): FishObj[] {
    const chosenFishes: FishObj[] = []
    while (poolSize > 0) {
        let i = Math.floor(Math.random() * FISH_DATA.length);
        chosenFishes.push(FISH_DATA[i])
        poolSize--;
    }
    return chosenFishes
};


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
    const size = (k.randi(1, 1.2)*fish.maxSize) / 6
    const speed = k.rand(1, 5)
    const sizeSprite = k.rect(size*2,size+(fish.maxWeight/50), {radius: 3})
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
            fishId: fish.fishId,
            name: fish.name,
            speed: speed,
            size: fish.maxSize,
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
            k.play("fishing-thunk", {volume: 0.2})
            k.destroy(bullet);
        });
        await k.wait(1);
        entity.enterState("idle");
    })

    let fishHooked = false
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
            if (gm.state === "catching") return;
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
            fishHooked = true
            const bobber = k.get("bobber")[0];
            if (!bobber) {
                entity.enterState("idle");
                fishHooked = false
            } else {
                entity.use(k.follow(bobber, k.vec2(0, 0)));
            }
        }
    })
    entity.onCollide("noticeArea", () => {
        if (gm.state === "catching") return;
        if (entity.state !== "idle" && entity.state !== "move" ) return
        entity.enterState("notice")
    })

    
    entity.onCollide("catchArea", () => {
        if (gm.state === "catching") return;
        k.play("icon-sound-2",{volume: 0.7}) //placeholder
        spawnCaughtFish(entity);
        if(!entity.fishId) throw new Error("id not found when spawning fish")

        gm.enterState("catching")
        entity.destroy();
        fishHooked = false;
        
    })

    entity.onStateEnter("hooked", () => {
        const bobber = k.get("bobber")[0];
        if (!bobber){
            entity.enterState("idle");
        }
    })


    entity.onStateEnter("notice", async () => {
        if (fishHooked) entity.enterState("idle");
        k.play("icon-sound-2",{volume: 0.2}) //placeholder
        const notice = entity.add([
            k.circle(0.5),
            k.color(COLORS.BEIGE)
        ])
        await k.wait(k.rand(1, 2))
        k.destroy(notice)
        entity.enterState("pursue");
    })
}






function spawnCaughtFish(fish: GameObj) {
    const bobber = k.get("bobber")[0];
    if (!bobber) return;

    const size = fish.size / 5 // CHANGE: Once u set up the correct size conversion above, change this too.
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
            id: fish.id,
            name: fish.name,
            size: fish.size,
            difficulty: fish.difficulty,
        },
        "caughtFish",
    ]);

    gm.currentFishId = fish.fishId.toString();
    gm.currentFishDifficulty = fish.difficulty;
    gm.currentFishSize = fish.size;

    let sizemodifier = k.clamp(fish.size, 2, 40) / 6

    bobber.onUpdate(() => {
        caughtFish.angle = k.rand(60, 120);
        if (k.chance(0.10))
        {
            let randomX = k.randi(-3-sizemodifier, 3+sizemodifier)
            let randomY = k.randi(-3-sizemodifier, 3+sizemodifier)

            let bubbles = k.add([
                k.pos(bobber.pos.x + randomX, bobber.pos.y + randomY),
                k.circle(k.rand(0.2, 0.3)),
                k.color(COLORS.WHITE),
                k.opacity(0.4),
                k.lifespan(0.4, {fade: 0.3}),
                k.z(8),
            ]);
            
            k.tween(
                bubbles.pos,
                bubbles.pos.add(k.vec2(randomX * 1.2, randomY * 1.2)),
                0.3,
                (p) =>  bubbles.pos = p, k.easings.easeInQuad
            ).then(() => {
                
                const ripple = bubbles.add([
                    k.pos(0, 0),
                    k.circle(0.3, { fill: false }),
                    k.outline(0.5, COLORS.BLUE),
                    k.opacity(0.3),
                    k.lifespan(0.4, { fade: 0.2 }),
                    k.anchor("center"),
                    {
                        update() {
                            ripple.radius += 0.2;
                        }
                    }
                ]);
            });
        }
    });

    return fish;

};
