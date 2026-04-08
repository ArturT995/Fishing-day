
export interface FishObj {
    id: number;
    name: string;
    maxSize: number;
    sprite: string;
    desc: string;
    unlocked: boolean;
    difficulty: number;
}

export interface RodObj {
    id: number;
    name: string;
    iconSprite: string;
    levelSprite: string;
    desc: string;
    unlocked: boolean;
    selected: boolean;
    reelSpeed: number;
    catchArea: number;
    endurance: number;
}


//make this a set for quicker lookups and no duplicates
//change difficulty into a number

export const FISH_DATA: FishObj[] = [
    {id: 0, name: "Orange Fish", sprite: "orangefishIcon",
    maxSize: 5, desc: "A common freshwater denizen.",  unlocked: false,
    difficulty: 1},
    {id: 1, name: "Orange Fish2", sprite: "orangefishIcon",
    maxSize: 5, desc: "A common freshwater denizen.",  unlocked: false,
    difficulty: 1},
    {id: 2, name: "Bluemer", sprite: "bluefishIcon",
    maxSize: 9, desc: "Strikingly blue.", unlocked: true,
    difficulty: 2},
    {id: 3, name: "Bluemer2", sprite: "bluefishIcon",
    maxSize: 9, desc: "Strikingly blue.", unlocked: true,
    difficulty: 2},
];


//rods
//get sprites for these and replace placeholder values and add rest of rods
export const RODS: RodObj[] = [
    {id: 0, name: "Wood rod", iconSprite: "woodRodIcon",
    levelSprite: "woodRod", desc: "A basic rod, enough to get the job done.",  unlocked: false,
    selected: false, reelSpeed: 15, catchArea: 15, endurance: 15},
    {id: 1, name: "Copper rod", iconSprite: "copperRodIcon",
    levelSprite: "copperRod", desc: "An improved rod, it is easier to handle.",  unlocked: false,
    selected: false, reelSpeed: 25, catchArea: 25, endurance: 25},
];


//items
//get icons and basics in for now, later do item specific interactions

//bag
//contains array of items, is a menu