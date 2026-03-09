import k from "../kaplayCtx";


export interface FishObj {
    id: number;
    name: string;
    size: number;
    sprite: string;
    desc: string;
    unlocked: boolean;
    difficulty: number;
}

export interface Bobber {
    size: number;
    sprite: string;
}



export const ANCHOR = k.vec2(k.width() / 2, k.height() - 12)

//make this a set for quicker lookups and no duplicates
//change difficulty into a number

export const FISH_AMOUNT = k.randi(12, 24)
export const FISH_DATA: FishObj[] = [
    {id: 0, name: "Orange Fish", sprite: "orangefishIcon",
    size: 5, desc: "A common freshwater denizen.",  unlocked: false,
    difficulty: 1},
    {id: 1, name: "Orange Fish", sprite: "orangefishIcon",
    size: 5, desc: "A common freshwater denizen.",  unlocked: false,
    difficulty: 1},
    {id: 2, name: "Bluemer", sprite: "bluefishIcon",
    size: 9, desc: "Strikingly blue.", unlocked: true,
    difficulty: 2},
    {id: 3, name: "Bluemer", sprite: "bluefishIcon",
    size: 9, desc: "Strikingly blue.", unlocked: true,
    difficulty: 2},
];


export function fishingPool(FISH_DATA: FishObj[], poolSize: number): FishObj[] {
    const chosenFishes: FishObj[] = []
    while (poolSize > 0) {
        let i = Math.floor(Math.random() * FISH_DATA.length);
        chosenFishes.push(FISH_DATA[i])
        poolSize--;
    }
    console.log(chosenFishes)
    return chosenFishes
};