import k from "./kaplayCtx";


export const COLORS = {
    BLUE: k.rgb(88, 130, 219),  
    DARKBLUE: k.rgb(21, 28, 45),
    DARKRED: k.rgb(54, 41, 41),
    BLACK: k.rgb(21, 4, 27),
    RED: k.rgb(201, 79, 79),    
    ORANGE: k.rgb(218, 154, 37),
    GREEN: k.rgb(118, 229, 114),
    BEIGE: k.rgb(231, 166, 133),
    YELLOW: k.rgb(255, 233, 109),
    GRAYBLUE: k.rgb(35, 40, 98),
    DARKGRAYBLUE: k.rgb(27, 19, 57),
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

