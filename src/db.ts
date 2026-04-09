
export interface FishObj {
    id: number;
    name: string;
    sprite: string;
    spriteLocked: string;
    activeTime: string;
    maxSize: number;
    maxWeight: number;
    rarityScore: number;
    desc: string;
    unlocked: boolean;
    difficulty: number;
    feature?: string;
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
//make function that assigns a sprite/fixed size range depending on fish size

// rarityscores: common = 1 uncommon = 3 rare = 8

export const FISH_DATA: FishObj[] = [
    {id: 0, name: "Yuppie", sprite: "yuppie", spriteLocked: "yuppie-locked", activeTime: "Day",
    maxSize: 10, maxWeight: 0.3, rarityScore: 4, desc: `This little denizen gets up at the crack of dawn,
    and displays a high level of activity throughout the day and well into the late evening.
    It has a sleek look and a go-getter attitude.`,  unlocked: true,
    difficulty: 2},

    {id: 1, name: "Carp", sprite: "carp", spriteLocked: "carp-locked", activeTime: "Day",
    maxSize: 80, maxWeight: 14, rarityScore: 1, desc: `A common coarse fish. Has a robust build and a dull gold sheen.
    It has a fixed frown on it's face. A single carp can lay over a million eggs in one year.
    Prefers cozy, brackish waters and soft sediments.`,  unlocked: true,
    difficulty: 1},

    {id: 2, name: "Ghost Carp", sprite: "ghostcarp", spriteLocked: "ghostcarp-locked", activeTime: "Night",
    maxSize: 80, maxWeight: 14, rarityScore: 8, desc: `The ghost of a fallen carp, 
    roaming the lake after sun has passed.
    "How did you catch this?" - Shopkeeper`,  unlocked: false,
    difficulty: 5},

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