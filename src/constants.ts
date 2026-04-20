import type { Vec2 } from "kaplay";
import k from "./kaplayCtx";


export const FISH_AMOUNT = k.randi(12, 18)
export const ANCHOR = k.vec2(k.width() / 2, k.height() - 12)


export const COLORS = {
    WHITE: k.rgb(255, 255, 255),  
    BLUE: k.rgb(88, 130, 219),  
    DARKBLUE: k.rgb(21, 28, 45),
    DARKRED: k.rgb(54, 41, 41),
    BLACK: k.rgb(21, 4, 27),
    RED: k.rgb(201, 79, 79),    
    ORANGE: k.rgb(218, 154, 37),
    GREEN: k.rgb(118, 229, 114),
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
        k.vec2(10, 67),
        k.vec2(78, 10),
        k.vec2(180, 17),
        k.vec2(252,118),
        k.vec2(163,188),
        k.vec2(10,67),
    ]),
    k.pos(0, 0),
    k.area(),
    k.opacity(1),
    "fishingarea"
]);

export type Stats = { 
            size: number, 
            difficulty: number,
            name: string,
            pos: Vec2,
        };