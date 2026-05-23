//
// code for movement and making fish bodies taken from fishGen.ts
//
import type { Vec2, GameObj, Color } from "kaplay";
import { COLORS, fishingAreaWarning } from "../constants";
import gm from "../gm";
import k from "../kaplayCtx";
import { type FishObj, FISH_DATA } from "../db";
import { playSound } from "../sounds";



export function fishingPool(FISH_DATA: FishObj[], poolSize: number, rarityMod = 1): FishObj[] {

    const dayFishes = FISH_DATA.filter((fish: FishObj) => fish.activeTime === "Day");
    const nightFishes = FISH_DATA.filter((fish: FishObj) => fish.activeTime === "Night");
    const chosenPool = gm.nightTime ? nightFishes : dayFishes
    

    //return chosenPool //disable after testing

    const chosenFishes: FishObj[] = []

    // shuffle array
    for (let i = chosenPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chosenPool[i], chosenPool[j]] = [chosenPool[j], chosenPool[i]];
    }

    
    let rodbonus = (Number(gm.equippedRodId) | 0)/8
    //final rod
    if (rodbonus >= 0.7) rodbonus += 2
    rarityMod += rodbonus

    const totalWeight = chosenPool.reduce((sum, f) => sum + Math.ceil((1 / f.rarityScore/rarityMod)), 0);

    while (poolSize > 0) {
        let roll = Math.random() * totalWeight
        for (const fish of chosenPool) {
            roll -= (1 / Math.ceil((fish.rarityScore/rarityMod)));


            if (roll <= 0) {
                gm.addFishToPool(fish.fishId)
                chosenFishes.push(fish)
                poolSize--
                break
            }
        }
    }


    return chosenFishes
};


export function generateFishes(amount = 0, rarityMod = 1) {
    const currentPool = [...gm.fishPool];
    
    currentPool.forEach(id => {
        const data = FISH_DATA.find(f => f.fishId === id);
        const isWrongTime = gm.nightTime 
            ? data?.activeTime === "Day" 
            : data?.activeTime === "Night";      
        if (isWrongTime) {
            gm.removeFishFromPool(id);
        }
    });

    // prevents duplication
    if (amount > 0) {
        const newFishes = fishingPool(FISH_DATA, amount, rarityMod);
        for (let fish of newFishes) {
            spawnFishInScene(fish);
        }
    } else {
        const existingFishes = gm.fishPool.map(id => 
            FISH_DATA.find(f => f.fishId === id)
        ).filter(f => f !== undefined) as FishObj[];

        for (let fish of existingFishes) {
            spawnFishInScene(fish);
        }
    }
}

function spawnFishInScene(fish: FishObj) {
    let randomPos = k.vec2(k.randi(12, 240), k.randi(12, 170));
    if (!fishingAreaWarning.hasPoint(randomPos)) {
        randomPos = k.vec2(k.randi(70, 150), k.randi(60, 130));
    }
    makeFish(fish, randomPos);
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

    let speed = k.randi(18,22) - Math.min(12,radices.length)
    let turnFactor = 0.15 / Math.min(13, radices.length)

    if (fish.name === "Old Boot") speed = 1;
    if (fish.name === "Goliath") speed = 4;

    let randomColor = COLORS.GRAYBLUE;
    if (gm.nightTime) randomColor = COLORS.BLACK

    const entity = k.add([
        k.pos(pos),
        k.circle(0),
        k.opacity(0),
        k.anchor("center"),
        k.area(),
        k.color(randomColor),
        k.rotate(0),
        k.state("idle", ["idle", "notice", "move", "pursue", "hooked"]),
        {   
            fishId: fish.fishId,
            name: fish.name,
            speed: speed,
            fadeSpeed: k.rand(0.05,0.3),
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

                    // night modifier
                    if (gm.nightTime) {
                        let v = 0.4
                        base = k.rgb(34*v, 38*v, 92*v)
                        tail = k.rgb(25*v, 28*v, 54*v)
                        head = k.rgb(21*v, 33*v, 30*v)
                    }

                    // special fish colors
                    if (entity.name === "Gilded Fish") [head, base, tail] = [setColor(k.rgb(220, 190, 100), deviation), setColor(k.rgb(244, 223, 149), deviation), setColor(k.rgb(248, 169, 84), deviation)];
                    if (entity.name === "Ghost Carp")  [head, base, tail] = [setColor(k.rgb(20, 100, 120), deviation),  setColor(k.rgb(60, 160, 180), deviation),  setColor(k.rgb(30, 110, 140), deviation)];
                    if (entity.name === "Starbass")    [head, base, tail] = [setColor(k.rgb(10, 60, 130), deviation),   setColor(k.rgb(40, 120, 180), deviation),  setColor(k.rgb(15, 70, 145), deviation)];
                    if (entity.name === "Shyfish")     [head, base, tail] = [setColor(k.rgb(60, 20, 100), deviation),   setColor(k.rgb(110, 60, 160), deviation),  setColor(k.rgb(70, 25, 115), deviation)];
                    if (entity.name === "Olly")        [head, base, tail] = [setColor(k.rgb(120, 70, 70), deviation),   setColor(k.rgb(165, 130, 105), deviation), setColor(k.rgb(105, 65, 55), deviation)];
                    if (entity.name === "Bobo")        [head, base, tail] = [setColor(k.rgb(180, 55, 112), deviation),  setColor(k.rgb(195, 85, 120), deviation),  setColor(k.rgb(120, 35, 90), deviation)];
                    if (entity.name === "Beardy")      [head, base, tail] = [setColor(k.rgb(15, 45, 35), deviation),    setColor(k.rgb(20, 50, 35), deviation),    setColor(k.rgb(10, 40, 25), deviation)];
                    if (entity.name === "Ale")         [head, base, tail] = [setColor(k.rgb(23, 12, 44), deviation),    setColor(k.rgb(47, 21, 68), deviation),    setColor(k.rgb(41, 23, 60), deviation)];
                    
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
    
    // Remove if you want silhouette look.
    // TODO: add option for turning colors on
    
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


    entity.onStateEnter("idle", async () => {
        entity.enterState("move");
    })

    // color mode
    entity.onKeyPress("t", () => {
        entity.randomColors()
    });

    // silhouette mode
    entity.onKeyPress("f", () => {
        entity.data.forEach((item) => {
            item.color = randomColor
        })
    });


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

        if (entity.opacity < 1) {
            entity.opacity += k.dt() * entity.fadeSpeed;
            if (entity.opacity > 1) entity.opacity = 1;
        }

        if (!fishingAreaWarning.hasPoint(entity.pos) && entity.state !== "pursue") {
            const safePoint = k.vec2(k.randi(80,130), k.randi(60,100)); 
            if (entity.waypoints[entity.currentWaypoint].dist(safePoint) > 1) {
                entity.waypoints[entity.currentWaypoint] = safePoint;
                entity.enterState("move");
            }
        }


        let bubbleChance = 0.01
        if (fish.feature === "extra bubbling") bubbleChance = 0.02
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
            alignBody(entity, movement, distance);
            entity.moveBy(movement);

        }

        if (entity.state === "pursue") {
            const bobber = k.get("bobber")[0];
            if (!bobber || gm.state === "catching") {
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
        const currentOpacity = entity.opacity;

        // fish shape drawn here
        if (entity.name !== "Old Boot") {
            
            entity.data.slice().reverse().forEach(({ pos, r, color }, i) => {
                k.drawCircle({ 
                    pos, 
                    radius: r, 
                    color, 
                    opacity: currentOpacity,
                    resolution: i < 2 ? 0.05 : 0.07 
                })

                // settings for fun or possible future item effects.
                //wildcolors(color)
            })
            

        } else {
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
                opacity: currentOpacity
            });
        }

    })

    entity.onCollide("noticeArea", () => {
        if (gm.state === "catching") return;
        if (entity.state !== "idle" && entity.state !== "move" ) return
        entity.enterState("notice")
    })

    
    entity.onCollide("catchArea", () => {
        if (gm.state === "catching") return;
        playSound("fishing-thunk", "sfx", 0.5 , false, -1000)
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
        playSound("icon-sound-1", "sfx", -0.3, false, 1000)
        entity.add([
            k.rect(1, 1),
            k.pos(1,-1),
            k.opacity(0.4),
            k.lifespan(1, { fade: 0.5 }),
            k.color(COLORS.BEIGE)
        ])
        await k.wait(k.rand(1, 2))
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
        k.opacity(0),
        k.color(COLORS.BLACK),
        k.rotate(90),
        {   
            id: fish.id,
            name: fish.name,
            size: fish.size,
            data: fish.data as { pos: Vec2, r: number, color: Color }[],
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
            // TODO: try to do this more efficently
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
                playSound("fishing-thunk", "sfx", -0.6, false, 0, 1.5);
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
    bobber.onDraw(() => {
        k.drawRect({width: caughtFish.data.length/2, height: caughtFish.data.length/k.randi(2,5), opacity: 1, angle: k.rand(90, 300), color: COLORS.BLACK})
        caughtFish.data.slice().reverse().forEach(({ pos, r, color }) => {
        color = COLORS.WHITE
        if (k.chance(0.2)) {
            pos.x = k.randi(1*(caughtFish.data.length/2), -1*(caughtFish.data.length/2))
            pos.y = k.randi(1*(caughtFish.data.length/2), -1*(caughtFish.data.length/2))
        }
            k.drawCircle({ pos, radius: r/k.rand(1.3, 3), color, resolution: 0.07, opacity: k.rand(0.2,0.8)})
    })

    })

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
    const tench = [0.6, 0.7, 1.3, 1.5, 1.6, 1.5, 0.9, 1, 1.2]
    const catfish = [3.5, 4, 4.5, 4.6, 5, 5.2, 2, 4.5, 4.5, 4, 4, 3.5, 3, 3, 4, 4]
    const beardy = [3.5, 4, 4.5, 4.6, 4, 2, 4, 3, 2, 3, 4, 4]
    const esox = [1, 1, 1, 1, 1.5, 1.5, 1.5, 1.5, 1.7, 1.8, 1.7, 1.5, 1.5, 1.5, 1, 1, 1, 1.2, 1.5]
    const small = smoothOutline([0.3, 0.6, 0.9, 1.0, 0.9, 0.7, 0.5, 0.3, 0.2])
    const mid = smoothOutline([0.6, 1.3, 1.7, 1.8, 1.6, 0.9, 1, 1.1]);
    const semibig = [1, 1, 2, 2, 2.5, 2.5, 3, 3, 3, 2.5, 2.5, 2, 2, 1, 1, 1, 2, 2]
    const big = [3.5, 4, 4.5, 4.5, 5, 2, 4.5, 4.5, 4, 4, 3.5, 3, 3, 4, 4];
    const long = smoothOutline([0.8, 1.0, 1.2, 1.2, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.5, 1, 0.9])

    const ale = smoothOutline([0.8, 0.8, 1.0, 1.0, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.3, 1.3, 1.2, 1.2, 1.2, 1.2, 1.1, 1.1, 1.0, 1.0, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.4])

    const originalLength = ale.length;
    for (let idx = 0; idx < originalLength; idx++) {
        ale[idx] = ale[idx]*2
    }


    if (size < 4.5) radices = mid
    if (length >= 6) radices = long
    if (size > 6) radices = big
    if (size >= 5) radices = semibig
    if (size <= 2) radices = small

    if (fish.name === "Eel") radices = long
    if (fish.name === "Tench") radices = tench
    if (fish.name === "Beardy") radices = beardy
    if (fish.name === "Catfish") radices = catfish
    if (fish.name === "Esox") radices = esox
    if (fish.name === "Ale") radices = ale

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


export function wildcolors(color: Color) {
    color.r -= 1
    color.g -= 1
    color.b -= 1
    if (color.r < 10 || color.g < 10 || color.b < 10) {
        color.r = k.randi(23,230)
        color.g = k.randi(23,230)
        color.b = k.randi(23,230)
    }
}

export function setColor(color: Color, deviation: number) {
    color.r += deviation
    color.g += deviation
    color.b += deviation
    return color;
}