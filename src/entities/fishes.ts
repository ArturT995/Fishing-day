//
// code for movement and making fish bodies taken from fishGen.ts
//
import type { Vec2, GameObj } from "kaplay";
import { COLORS, FISH_AMOUNT, fishingArea, fishingAreaWarning } from "../constants";
import gm from "../gm";
import k from "../kaplayCtx";
import { type FishObj, FISH_DATA } from "../db";



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
        if (!fishingAreaWarning.hasPoint(randomPos)) {
            randomPos = k.vec2(k.randi(70,150), k.randi(60,130))
        }
        makeFish(fish, randomPos)
    }
}


export function makeFish(fish: FishObj, pos: Vec2) {
    const sizeInput = (k.rand(1, 1.2)*fish.maxWeight)
    const exponent = 0.45;
    let size = Math.pow(sizeInput, exponent); //scales down bigger fish
    let length = Math.pow(fish.maxSize, exponent);

    const r = 50;
    let dir = k.vec2(0, 1);
    let distance = 1

    if (size <= 2) distance = 0.6
    if (size >= 7) distance = 1.2
    
    let radices = makeShape(fish, size, length)

    let speed = 20 - Math.min(12,radices.length)
    let turnFactor = 0.15 / Math.min(13, radices.length)

    if (fish.name === "Old Boot") speed = 1;
    
    const fishColors = [COLORS.GRAYBLUE, COLORS.DARKGRAYBLUE, COLORS.BLACK];
    const randomColor = k.choose(fishColors);

    const entity = k.add([
        k.pos(pos),
        k.circle(0),
        k.opacity(1),
        k.anchor("center"),
        k.area(),
        k.color(randomColor),
        k.rotate(0),
        k.state("idle", ["idle", "notice", "move", "pursue", "hooked", "attack"]),
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
            currentWaypoint: 0,
            //movement and shape data
            data: radices.map((r: number, i: number) => {
                return {
                    pos: dir.scale(-i * distance),
                    r,
                    color: randomColor
                }
            }),
            dir,
            turnFactor: turnFactor,
            randomColors: () => {
                entity.data.forEach((item, index, array) => {
                    let base = k.rgb(34, 38, 92)
                    let tail = k.rgb(25, 28, 54)
                    let head = k.rgb(21, 33, 30)
                    if (k.chance(0.1)) base = k.rgb(22, 33, 30)
                    if (k.chance(0.02)) base = k.rgb(45, 13, 13)
                    const deviation = k.rand(-15, 5)
                    const add = deviation + 10;

                    

                    // special fish colors
                    if (entity.name === "Gilded Fish") [head, base, tail] = [k.rgb(220 + deviation, 190 + deviation, 100 + deviation), k.rgb(244 + deviation, 223 + deviation, 149 + deviation), k.rgb(248 + deviation, 169 + deviation, 84 + deviation)];
                    if (entity.name === "Ghost Carp")  [head, base, tail] = [k.rgb(20 + deviation, 100 + deviation, 120 + deviation),  k.rgb(60 + deviation, 160 + deviation, 180 + deviation),  k.rgb(30 + deviation, 110 + deviation, 140 + deviation)];
                    if (entity.name === "Shyfish")     [head, base, tail] = [k.rgb(60 + deviation, 20 + deviation, 100 + deviation),   k.rgb(110 + deviation, 60 + deviation, 160 + deviation),  k.rgb(70 + deviation, 25 + deviation, 115 + deviation)];
                    if (entity.name === "Olly")        [head, base, tail] = [k.rgb(120 + deviation, 70 + deviation, 70 + deviation),   k.rgb(165 + deviation, 130 + deviation, 105 + deviation), k.rgb(105 + deviation, 65 + deviation, 55 + deviation)];
                    if (entity.name === "Beardy")      [head, base, tail] = [k.rgb(15 + deviation, 45 + deviation, 35 + deviation),   k.rgb(20 + deviation, 50 + deviation, 35 + deviation),   k.rgb(10 + deviation, 40 + deviation, 25 + deviation)];
                    
                    item.color = k.rgb(base.r + deviation, base.g + deviation, base.b + deviation)
                    if (index <= 2) item.color = head
                    if (Math.ceil((array.length/100) * 60) <= index && index <= Math.ceil((array.length/100) * 80)) {
                        item.color = k.rgb(base.r + add, base.g + add, base.b + add)
                    };
                    if (index >= Math.floor((array.length/100) * 80)) item.color = tail
                })
            }
        },
        "fish",
    ]);
    
    //Remove if you want shilouette look.
    entity.randomColors()

    let fishName = k.add([
            k.text("", {size: 4, font: "happy"}),
            k.pos(entity.pos.x + 5, entity.pos.y + 5),
            k.rotate(0),
            k.opacity(0),
            k.color(COLORS.ORANGE),
            k.z(2),
            "fishName",
    ]);

    if (gm.identifierOn) {
        fishName.text = `${entity.name}`
        fishName.opacity = 0.5
    };

    /* disable in debug
    const delay = k.rand(1, 8);

    k.wait(delay, () => {
        entity.opacity = k.rand(0.4, 0.7);

        entity.fadeIn(k.rand(5, 18));
    });
    */

    entity.onStateEnter("idle", async () => {
        entity.enterState("move");
    })

    entity.onKeyPress("k", () => {
        entity.enterState("attack");
    });

    entity.onKeyPress("d", () => {
        entity.randomColors()
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
        fishName.pos = entity.pos;
        
        if (gm.identifierOn) {
            fishName.text = `${entity.name}`
            fishName.opacity = 0.5
        } else {
            fishName.text = `${entity.name}`
            if (fishName.opacity > 0) fishName.opacity -= 0.01
        };

        if (!fishingAreaWarning.hasPoint(entity.pos)) {
            const safePoint = k.vec2(k.randi(70,150), k.randi(60,130)); 
            if (entity.waypoints[entity.currentWaypoint].dist(safePoint) > 1) {
                entity.waypoints[entity.currentWaypoint] = safePoint;
                entity.enterState("move");
            }
        }


        let bubbleChance = 0.01
        if (fish.feature === "extra bubbling") bubbleChance = 0.04
        if (k.chance(bubbleChance)) {
            if (fish.feature === "no bubbling") return;
            fishBubbles(entity.pos)
        }

        const target = entity.waypoints[entity.currentWaypoint];
        
        if (entity.state === "move") {
            if (entity.pos.dist(target) < 5) {
                entity.currentWaypoint = (entity.currentWaypoint + 1) % entity.waypoints.length;
                entity.enterState("idle");
            };

            const turnDt = k.dt() * 120
            const toTarget = target.sub(entity.pos).unit().scale(entity.turnFactor * turnDt)

            entity.dir = entity.dir.add(toTarget).unit()

            const velocity = entity.dir.scale(entity.speed)
            const movement = velocity.scale(k.dt())

            alignBody(entity, movement, distance)
            entity.moveBy(movement)
        }

        
        if (entity.state === "pursue") {
            if (gm.state === "catching") return;
            const bobber = k.get("bobber")[0];
            if (!bobber) {
                entity.enterState("idle");
            } else {
                const dir = bobber.pos.sub(entity.pos).unit();
                //const mouseDir = k.mousePos().sub(entity.pos).unit();
                const pursuitVelocity = dir.scale(entity.speed * 1.5);
                const pursuitMovement = pursuitVelocity.scale(k.dt());

                entity.moveBy(pursuitMovement);
                alignBody(entity, pursuitMovement, distance);
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

    entity.onDraw(() => {
        if (entity.name === "Old Boot") {
            entity.angle = k.randi(-4, 6)
            const { pos } = entity.data[0];
            k.drawPolygon({
                pts: [
                    k.vec2(pos.x - 1,   pos.y - 2),
                    k.vec2(pos.x + 0.5, pos.y - 2),
                    k.vec2(pos.x + 0.5, pos.y - 0.5),
                    k.vec2(pos.x + 1.8, pos.y - 0.5),
                    k.vec2(pos.x + 1.8, pos.y + 0.2),
                    k.vec2(pos.x - 1,   pos.y + 0.2),
                ],
                color: k.rgb(31, 27, 22),
            });
        } else {
            entity.data.forEach(({ pos, r, color }) => {
                k.drawCircle({ pos, radius: r, color })
            })
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
        fishName.destroy();
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

    return entity;
}






function spawnCaughtFish(fish: GameObj) {
    const bobber = k.get("bobber")[0];
    if (!bobber) return;

    const sizeInput = (k.rand(1, 1.2)*fish.size)
    const exponent = 0.45;
    let size = Math.pow(sizeInput, exponent);

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

function fishBubbles(pos: Vec2) {
    k.add([
        k.pos(pos),
        k.circle(k.rand(0.2, 1)),
        k.color(COLORS.BLUE),
        k.opacity(0.2),
        k.lifespan(1, { fade: 0.5 }),
    ]);
};

function alignBody(entity: GameObj, movement: Vec2, distance: number) {
    
    for (const item of entity.data) {
            item.pos = item.pos.sub(movement)
        }
    entity.data.forEach((item: { pos: Vec2 }, i: number) => {
        const prev = entity.data[i - 1]
        if (prev) {
            const delta = item.pos.sub(prev.pos)
            const deltaLength = delta.len()

            if (deltaLength > 0) {
                item.pos = prev.pos.add(delta.scale(distance / deltaLength))
            } else {
                item.pos = prev.pos.sub(entity.dir.scale(distance))
            }
        } else {
            // Reset the first link
            item.pos = k.vec2(0, 0)
        }
    })
}


function makeShape(fish: FishObj, size: number, length: number) {

    let radices = [0.5, 1, 0.9, 0.4, 0.6, 0.8] //default
    const tench = [0.7, 1.3, 1.8, 1.9, 1.7, 0.9, 1, 1.1]
    const catfish = [3.5, 4, 4.5, 4.6, 5, 5.2, 2, 4.5, 4.5, 4, 4, 3.5, 3, 3, 4, 4]
    const beardy = [3.5, 4, 4.5, 4.6, 4, 2, 4, 3, 2, 3, 4, 4]
    const esox = [1, 1, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.7, 1.8, 1.7, 1.5, 1.5, 1.5, 1, 1, 1, 1.2, 1.5]
    const small = smoothOutline([0.3, 0.6, 0.9, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2])
    const mid = smoothOutline([0.6, 1.3, 1.7, 1.8, 1.6, 0.9, 1, 1.1]);
    const semibig = [1, 1, 2, 2, 2.5, 2.5, 3, 3, 3, 2.5, 2.5, 2, 2, 1, 1, 1, 2, 2]
    const big = [3.5, 4, 4.5, 4.5, 5, 2, 4.5, 4.5, 4, 4, 3.5, 3, 3, 4, 4];
    const long = smoothOutline([0.8, 1.0, 1.2, 1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.5, 1, 0.9])






    if (size <= 2) radices = small
    if (size < 4.5) radices = mid
    if (length >= 6) radices = long
    if (size >= 5) radices = semibig
    if (size > 6) radices = big

    if (fish.name === "Tench") radices = tench
    if (fish.name === "Beardy") radices = beardy
    if (fish.name === "Catfish") radices = catfish
    if (fish.name === "Esox") radices = esox
  
    //k.debug.log(`Size: ${size} , Length: ${length}`)
    return radices;
}


function smoothOutline(r: number[], passes = 3): number[] {
    let out = [...r]
    for (let p = 0; p < passes; p++) {
        const next = [...out]
        for (let i = 1; i < out.length - 1; i++) {
            next[i] = out[i - 1] * 0.25 + out[i] * 0.5 + out[i + 1] * 0.25
        }
        out = next
    }
    return out
}