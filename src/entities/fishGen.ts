//
// credits to Muffinman for the content in this file
//


import type { Vec2 } from "kaplay"
import k from "../kaplayCtx"
import { COLORS } from "../constants"

let currentPos = k.vec2(120, 120)

export const getMoveTarget = (currentPos: Vec2) => {
    let newPos = k.vec2(k.randi(20, k.width() - 20), k.randi(20, k.height() - 20))

    // Select a point that is not too close to the current position
    if (currentPos) {
        while (currentPos.dist(newPos) < 50) {
            newPos = k.vec2(k.randi(20, k.width() - 20), k.randi(20, k.height() - 20))
        }
    }

    return newPos
}

export const addFishie = (radices: any[], distance: number, options: any = {}) => {
    const {
        pos = k.center(),
        dir = k.vec2(0, 1),
        color = COLORS.DARKBLUE,
        speed: optionsSpeed,
        turnFactor: optionsTurnFactor,
        speed = 40,
        turnFactor = 0.05,
        interval = 1,
        debug = false
    } = options

    if (radices.length < 2) {
        throw new Error("radices must have at least 2 elements")
    }

    // Init
    const fishie = k.add([
        "fishie",
        k.pos(pos),
        k.timer(),
        {
            data: radices.map((r: any, i: number) => {
                return {
                    pos: dir.scale(-i * distance),
                    r,
                    color
                }
            }),
            dir,
            turnFactor: optionsTurnFactor ?? turnFactor,
            speed: optionsSpeed ?? speed,
            getMoveTarget,
            moveTarget: getMoveTarget(currentPos),
            // Debug
            debug,
            updateColors: () => {
                fishie.data.forEach((item: { color: any }) => {
                    item.color = fishie.debug
                        ? k.rgb(k.randi(255), k.randi(255), k.randi(255))
                        : color
                })
            }
        }
    ])

    // For debug, feel free to remove
    fishie.updateColors()

    // Update
    fishie.onUpdate(() => {
        // I tweaked movement without using dt() on 120fps, so when I switched to dt() I added this factor to get the same movement speed
        const turnDt = k.dt() * 120
        const toTarget = fishie.moveTarget
            .sub(fishie.pos)
            .unit()
            .scale(fishie.turnFactor * turnDt)

        fishie.dir = fishie.dir.add(toTarget).unit()

        const velocity = fishie.dir.scale(fishie.speed)
        const movement = velocity.scale(k.dt())
        fishie.moveBy(movement)

        for (const item of fishie.data) {
            item.pos = item.pos.sub(movement)
        }

        fishie.data.forEach((item: { pos: Vec2 }, i: number) => {
            const prev = fishie.data[i - 1]
            if (prev) {
                const delta = item.pos.sub(prev.pos)
                const deltaLength = delta.len()

                if (deltaLength > 0) {
                    item.pos = prev.pos.add(delta.scale(distance / deltaLength))
                } else {
                    item.pos = prev.pos.sub(fishie.dir.scale(distance))
                }
            } else {
                // Reset the first link
                item.pos = k.vec2(0, 0)
            }
        })
    })

    // Draw
    fishie.onDraw(() => {
        fishie.data.forEach(({ pos, r, color }) => {
            k.drawCircle({ pos, radius: r, color })
        })
    })

    // Change movement target on a fixed interval
    fishie.loop(interval, () => {
        fishie.moveTarget = getMoveTarget(fishie.pos)
    })

    return fishie
}



const fishie1 = addFishie(
    [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 2, 2],
    1,
    {
        pos: getMoveTarget(k.vec2(0,0)),
        interval: 1.5
    }
)

const fishie2 = addFishie(
    [1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2, 1.5, 1.5, 1.5, 1, 1, 1, 1.5, 1.5],
    1,
    {
        pos: getMoveTarget(k.vec2(120, 120)),
        turnFactor: 0.1,
        speed: 60
    }
)

const fishie3 = addFishie(
    [1.5, 2, 2, 2, 1.5, 1.5, 1.5, 1, 1, 1, 1.5, 1.5],
    1,
    {
        pos: getMoveTarget(k.vec2(120, 120)),
        turnFactor: 0.1,
        speed: 60
    }
)

const fishie4 = addFishie(
    [3.5, 4, 4.5, 4.5, 5, 5, 4.5, 4.5, 4, 4, 3.5, 3, 3, 4, 4],
    2,
    {
        pos: getMoveTarget(k.vec2(120, 120)),
        turnFactor: 0.02,
        speed: 30
    }
)

export const fishies = [fishie1, fishie2, fishie3, fishie4]

k.onKeyPress("d", () => {
    fishies.forEach(fishie => {
        fishie.debug = !fishie.debug
        fishie.updateColors()
    })
})
