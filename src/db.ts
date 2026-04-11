
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
    maxSize: 10, maxWeight: 0.3, rarityScore: 4,
    desc: `This little denizen gets up at the crack of dawn,
    and displays a high level of activity throughout the day and well into the late evening.
    It has a sleek look and a go-getter attitude.`,
    unlocked: true, difficulty: 2, feature: ""},

    {id: 1, name: "Carp", sprite: "carp", spriteLocked: "carp-locked", activeTime: "Day",
    maxSize: 25, maxWeight: 14, rarityScore: 1,
    desc: `A common coarse fish. Has a robust build and a dull gold sheen.
    It has a fixed frown on it's face. A single carp can lay over a million eggs in one year.
    Prefers cozy, brackish waters and soft sediments.`, 
    unlocked: true, difficulty: 1, feature: ""},

    {id: 2, name: "Ghost Carp", sprite: "ghostcarp", spriteLocked: "ghostcarp-locked", activeTime: "Night",
    maxSize: 25, maxWeight: 14, rarityScore: 8,
    desc: `The ghost of a fallen carp, 
    roaming the lake after sun has passed.
    "How did you catch this?" - Shopkeeper`,
    unlocked: false, difficulty: 5, feature: "no bubbling"},

    {id: 3, name: "Tench", sprite: "tench", spriteLocked: "tench-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 4, rarityScore: 1,
    desc: `A stocky olive-green fish. Its scales are tiny
    and deeply embedded, making it as slippery as an eel.
    According to folklore a Tench's slime had curative properties
    on other fish, giving it the nickname Doctor Fish.`, 
    unlocked: true, difficulty: 2, feature: "extra bubbling"},

    {id: 4, name: "Fishbones", sprite: "fishbones", spriteLocked: "fishbones-locked", activeTime: "Night",
    maxSize: 20, maxWeight: 0.5, rarityScore: 8,
    desc: `A stocky olive-green fish. Its scales are tiny
    and deeply embedded, making it as slippery as an eel.
    According to folklore a Tench's slime had curative properties
    on other fish, giving it the nickname Doctor Fish.`, 
    unlocked: false, difficulty: 3, feature: "no bubbling"},

    {id: 5, name: "Gilded Fish", sprite: "gildedfish", spriteLocked: "gildedfish-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 5, rarityScore: 50,
    desc: `This fish has ganoid scales that resemble gold and have similar properties.
    It has lead to the scales being used as a popular version of fools gold.
    Alchemists grind the scales into dust and treat it chemically, 
    removing imperfections and sell it as gold powder.
    "Now this is a rare sight! Folks used to fish entire lakes dry in search of this fish." - Shopkeeper`, 
    unlocked: true, difficulty: 3, feature: "Icon sparkles/glows"},

    {id: 6, name: "Spotted Gar", sprite: "spottedgar", spriteLocked: "spottedgar-locked", activeTime: "Day",
    maxSize: 28, maxWeight: 4, rarityScore: 1,
    desc: `Thick scales cover this fish, it's mouth filled with long, sharp teeth.
    It's most commonly found in clear, shallow waters and hunts smaller fish.`,
    unlocked: false, difficulty: 4, feature: ""},

    {id: 7, name: "Alligator Gar", sprite: "alligatorgar", spriteLocked: "alligatorgar-locked", activeTime: "Night",
    maxSize: 45, maxWeight: 120, rarityScore: 12,
    desc: `A massive, slow moving fish. The largest species of the gar family.
    It stalks the waters, looking to ambush other fish, waterfowl and small mammals.
    The scales have serrated edges and have a tough inner layer of bone.
    It's estimated to live between 50 to 70 years.
    "How did you manage to catch that?!" - Shopkeeper.`,
    unlocked: true, difficulty: 10, feature: ""},

    {id: 8, name: "Esox", sprite: "esox", spriteLocked: "esox-locked", activeTime: "Day",
    maxSize: 32, maxWeight: 25, rarityScore: 6,
    desc: `Commonly known as pike. They have a torpedo-like shape typical of predatory fishes.
    Typically of grey-green color and mottled appearance. Many unwary anglers have
    been bitten by them.`,
    unlocked: true, difficulty: 6, feature: "Aggressive"},

    {id: 9, name: "Freshwater drum", sprite: "freshwaterdrum", spriteLocked: "freshwaterdrum-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 10, rarityScore: 4,
    desc: `It is also called Russell fish, Shepherd's pie, Gray bass, Gasper goo,
    Gaspergou, Gou, Grunt, Grunter, Grinder, Gooble Gobble, and Croaker.
    The males make a "grunting" noise that comes from a special set of muscles
    that vibrate against the swim bladder. The purpose of the grunting is unknown.`,
    unlocked: true, difficulty: 3, feature: "Grunting"},

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