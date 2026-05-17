import type { Vec2 } from "kaplay";
import k from "./kaplayCtx";

export const FISH_TIMER = 1000;
export const FISH_AMOUNT = k.randi(12, 18)
export const ANCHOR = k.vec2(k.width() / 2, k.height() - 47)



export const COLORS = {
    WHITE: k.rgb(255, 255, 255),  
    BLUE: k.rgb(88, 130, 219),  
    DARKBLUE: k.rgb(21, 28, 45),
    DARKRED: k.rgb(54, 41, 41),
    BLACK: k.rgb(21, 4, 27),
    RED: k.rgb(201, 79, 79),    
    ORANGE: k.rgb(184, 139, 54),
    GREEN: k.rgb(47, 227, 41),
    LIGHTGREEN: k.rgb(129, 255, 117),
    BEIGE: k.rgb(231, 166, 133),
    BROWN: k.rgb(72, 52, 37),
    YELLOW: k.rgb(255, 233, 109),
    PURPLE: k.rgb(184, 52, 255),
    GRAYBLUE: k.rgb(29, 33, 73),
    DARKGRAYBLUE: k.rgb(12, 9, 23),
};

type FontConfig = {
    font: string;
    size: number;
};

export const fontConfig: FontConfig = {
    font: "happy",
    size: 8
};

export const fontConfigLarge: FontConfig = {
    font: "happy",
    size: 12
};

export const fontConfigSmall: FontConfig = {
    font: "happy",
    size: 6
};

export let fishHooked = false;

export const fishingArea = k.add([
        k.polygon([
            k.vec2(30, 57),
            k.vec2(78, 5),
            k.vec2(170, 5),
            k.vec2(190, 50),
            k.vec2(242,108),
            k.vec2(242,128),
            k.vec2(154,178),
            k.vec2(120,158),
            k.vec2(30, 87),
        ]),
        k.pos(0, 0),
        k.area(),
        k.opacity(0),
        "fishingarea"
    ]);

export const fishingAreaWarning = k.add([
    k.polygon([
        k.vec2(45.9,  70.3),
        k.vec2(91.8,  21.8),
        k.vec2(164.0, 21.8),
        k.vec2(180.0, 57.5),
        k.vec2(229.3, 114.3),
        k.vec2(158.3, 120.9),
        k.vec2(122.5, 110.9),
        k.vec2(45.9,  70.3),
    ]),
    k.pos(0, 0),
    k.area(),
    k.opacity(0),
    k.z(2),
    "fishingareawarning"
]);

export const rodArea = k.add([
    k.circle(20),
    k.pos(ANCHOR.x, ANCHOR.y),
    k.z(3),
    k.opacity(0),
    k.area(),
    "rodArea"
]);

export type Stats = { 
            size: number, 
            difficulty: number,
            name: string,
            pos: Vec2,
        };