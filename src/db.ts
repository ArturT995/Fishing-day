
export interface FishObj{
    fishId: string;
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
    price: number;
    feature?: string;

}

export interface ShopObj{
    itemId: string;
    name: string;
    sprite: string;
    desc: string;
    price: number;
    unlocked: boolean;
    feature: string;
}

export interface RodObj {
    rodId: string;
    name: string;
    unlocked: boolean;
    selected: boolean;
    reelSpeed: number;
    catchArea: number;
    endurance: number;
}

export type BagObj = ShopObj & { count: number };



export const ROD_DATA: any[] = [

    {rodId: "1", name: "Wood rod", unlocked: true,
    selected: true, reelSpeed: 70, catchArea: 10, endurance: 12},

    {rodId: "2", name: "Copper rod", unlocked: false,
    selected: false, reelSpeed: 80, catchArea: 12, endurance: 12},

    {rodId: "3", name: "Elegant Rod", unlocked: false,
    selected: false, reelSpeed: 90, catchArea: 13, endurance: 13},

    {rodId: "4", name: "Exquisite rod", unlocked: true,
    selected: true, reelSpeed: 100, catchArea: 14, endurance: 14},

    {rodId: "5", name: "Excellent rod", unlocked: false,
    selected: false, reelSpeed: 110, catchArea: 16, endurance: 15},

    {rodId: "6", name: "Legendary rod", unlocked: false,
    selected: false, reelSpeed: 130, catchArea: 20, endurance: 17},

]

//make function that assigns a sprite/fixed size range depending on fish size

// rarityscores: common = 1 uncommon = 3 rare = 8

export const ITEM_DATA: ShopObj[] = [

    {itemId: "1", name: "Beer", sprite: "beer",
    desc: "A cold bottle of beer, sure to bring some refreshment after a hard day of fishing", 
    price: 10, unlocked: false, feature: "Misc"},

    {itemId: "2", name: "Deluxe Bait", sprite: "deluxebait",
    desc: "These pungent chunks are irresistible to fish, lasts for 5 uses", 
    price: 30, unlocked: false, feature: "Buff"},

    {itemId: "3", name: "Fish Feed Can", sprite: "fishfeedcan",
    desc: "Use this to attract more fish to the lake",
    price: 120, unlocked: false, feature: "Item"},

    {itemId: "4", name: "Coffee", sprite: "coffee",
    desc: "The best beverage there is, don't drink too much though!",
    price: 20, unlocked: false, feature: "Buff"},

    {itemId: "5", name: "Glasses", sprite: "glasses",
    desc: "A pair of old glasses, you notice that you see sharper with them on, looks like you have light myopia.",
    price: 10, unlocked: false, feature: "Unique"},

    {itemId: "6", name: "Rancid gloop", sprite: "rancidgloop",
    desc: `A disgusting mess, even fish are deterred by this. Used by some to clear areas in the lake, thus allowing different types of fish to emerge sometimes`,
    price: 10, unlocked: false, feature: "Item"},

    {itemId: "7", name: "Fish Feed Deluxe", sprite: "fishfeeddeluxe",
    desc: `A delicacy so potent it drives the fish into a frenzy, empty lakes are filled. 
    Even the rarest of fish might come out of hiding.`,
    price: 250, unlocked: false, feature: "Item"},

    // rods

    {itemId:" 8", name: "Wood rod", sprite: "woodrod",
    desc: `A basic rod, enough to get the job done`,
    price: 40, unlocked: false, feature: "Rod Unique"},

    {itemId:" 9", name: "Copper rod", sprite: "copperrod",
    desc: `An improved rod, it is easier to handle.`,
    price: 170, unlocked: false, feature: "Rod Unique"},

    {itemId: "10", name: "Elegant Rod", sprite: "elegantrod",
    desc: `A graceful rod, it is lighter and feels comfortable in your hands.`,
    price: 500, unlocked: false, feature: "Rod Unique"},

    {itemId: "11", name: "Exquisite rod", sprite: "exquisiterod",
    desc: `Quite a feat of craftsmanship. It has a great grip, weight and handles well.`,
    price: 900, unlocked: false, feature: "Rod Unique"},

    {itemId: "12", name: "Excellent rod", sprite: "excellentrod",
    desc: `This rod feels perfect! You didn't think rods could be done at such a level.`,
    price: 1250, unlocked: false, feature: "Rod Unique"},

    {itemId: "13", name: "Legendary rod", sprite: "legendaryrod",
    desc: `Tales have been told of an ancient ornate rod that can tame the mightiest of fish. 
    To see it in person fills you with awe. You feel a strange tingling when you hold it.`,
    price: 2300, unlocked: false, feature: "Rod Unique"},

    // night and misc items

    {itemId: "14", name: "Fish identifier", sprite: "fishidentifier",
    desc: `You're not sure how, but this curious contraption makes you sense what fish are swimming in the lake,
    when you activate it, you see smoke rising from one of the tubes and looking through the circle causes your
    head to hurt a bit, you notice some faint green splotches in your vision that emerge and fade.
    You are able to sense what fish are swimming in the lake.`,
    price: 3000, unlocked: false, feature: "Unique"},

    {itemId: "15", name: "Dice", sprite: "dice",
    desc: `You feel luckier holding them, can be rolled to alleviate boredom`,
    price: 200, unlocked: false, feature: "Night Unique"},

    {itemId: "16", name: "Cards", sprite: "cards",
    desc: `You feel luckier holding them, can be played with to alleviate boredom`,
    price: 200, unlocked: false, feature: "Night Unique"},

    {itemId: "17", name: "Grog", sprite: "grog",
    desc: `A moderate beverage, soothes your worries.`,
    price: 35, unlocked: false, feature: "Night item"},

    {itemId: "18", name: "Red Rum", sprite: "redrum",
    desc: `A proper drink, you remember getting quite boisterous from this years ago.`,
    price: 50, unlocked: false, feature: "Night item"},

    {itemId: "19", name: "Pipe", sprite: "pipe",
    desc: `A calming pipe, to make the night pass away with ease.`,
    price: 200, unlocked: false, feature: "Night Unique"},

    {itemId: "20", name: "Fried Fish", sprite: "friedfish",
    desc: `Some nice fried fish, your favorite.`,
    price: 40, unlocked: false, feature: "Item"},

    {itemId: "21", name: "Birdfeed", sprite: "birdfeed",
    desc: `Feed to a bird to make them happy`,
    price: 15, unlocked: false, feature: "Item"},

    {itemId: "22", name: "Bugfeed", sprite: "bugfeed",
    desc: `Feed to a bug to make them happy`,
    price: 15, unlocked: false, feature: "Item"},

    //  next up decor and endgame items

    //  pier, lantern, red lights, beach umbrella, beach chair, 4 monuments, medal of completion.

]


export const FISH_DATA: FishObj[] = [
    {fishId:" 1", name: "Yuppie", sprite: "yuppie", spriteLocked: "yuppie-locked", activeTime: "Day",
    maxSize: 10, maxWeight: 0.3, rarityScore: 10,
    desc: `This little denizen gets up at the crack of dawn and displays a high level of activity throughout the day and well into the late evening.
    It has a sleek look and a go-getter attitude.`,
    unlocked: false, difficulty: 2, price: 50, feature: ""},

    {fishId:" 2", name: "Carp", sprite: "carp", spriteLocked: "carp-locked", activeTime: "Day",
    maxSize: 25, maxWeight: 14, rarityScore: 1,
    desc: `A common coarse fish. Has a robust build and a dull gold sheen.
    It has a fixed frown on it's face. A single carp can lay over a million eggs in one year.
    Prefers cozy, brackish waters and soft sediments.`, 
    unlocked: false, difficulty: 1, price: 30, feature: ""},

    {fishId:" 3", name: "Ghost Carp", sprite: "ghostcarp", spriteLocked: "ghostcarp-locked", activeTime: "Night",
    maxSize: 25, maxWeight: 14, rarityScore: 20,
    desc: `The ghost of a fallen carp, 
    roaming the lake after sun has passed.
    "How did you catch this?" - Shopkeeper`,
    unlocked: false, difficulty: 5, price: 75, feature: "no bubbling"},

    {fishId:" 4", name: "Tench", sprite: "tench", spriteLocked: "tench-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 4, rarityScore: 1,
    desc: `A stocky olive-green fish. Its scales are tiny
    and deeply embedded, making it as slippery as an eel.
    According to folklore a Tench's slime had curative properties
    on other fish, giving it the nickname Doctor Fish.`, 
    unlocked: false, difficulty: 2, price: 20, feature: "extra bubbling"},

    {fishId:" 5", name: "Fishbones", sprite: "fishbones", spriteLocked: "fishbones-locked", activeTime: "Night",
    maxSize: 20, maxWeight: 0.5, rarityScore: 20,
    desc: `Lifeless remains of a fish you can't identify, you are
    unsure how it got hooked.
    "You want me to buy this?" - Shopkeeper`, 
    unlocked: false, difficulty: 3, price: 5, feature: "no bubbling"},

    {fishId:" 6", name: "Gilded Fish", sprite: "gildedfish", spriteLocked: "gildedfish-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 5, rarityScore: 50,
    desc: `This fish has ganoid scales that resemble gold and have similar properties.
    It has lead to the scales being used as a popular version of fools gold.
    Alchemists grind the scales into dust and treat it chemically, 
    removing imperfections and sell it as gold powder.
    "Now this is a rare sight! Folks used to fish entire lakes dry in search of this fish." - Shopkeeper`, 
    unlocked: false, difficulty: 3, price: 1500, feature: "Icon sparkles/glows"},

    {fishId:" 7", name: "Spotted Gar", sprite: "spottedgar", spriteLocked: "spottedgar-locked", activeTime: "Day",
    maxSize: 28, maxWeight: 4, rarityScore: 1,
    desc: `Thick scales cover this fish, it's mouth filled with long, sharp teeth.
    It's most commonly found in clear, shallow waters and hunts smaller fish.`,
    unlocked: false, difficulty: 4, price: 30, feature: ""},

    {fishId:" 8", name: "Alligator Gar", sprite: "alligatorgar", spriteLocked: "alligatorgar-locked", activeTime: "Night",
    maxSize: 45, maxWeight: 120, rarityScore: 35,
    desc: `A massive, slow moving fish. The largest species of the gar family.
    It stalks the waters, looking to ambush other fish, waterfowl and small mammals.
    The scales have serrated edges and have a tough inner layer of bone.
    It's estimated to live between 50 to 70 years.
    "How did you manage to catch that?!" - Shopkeeper.`,
    unlocked: false, difficulty: 10, price: 220, feature: ""},

    {fishId:" 9", name: "Esox", sprite: "esox", spriteLocked: "esox-locked", activeTime: "Day",
    maxSize: 32, maxWeight: 25, rarityScore: 14,
    desc: `Commonly known as pike. They have a torpedo-like shape typical of predatory fishes.
    Typically of grey-green color and mottled appearance. Many unwary anglers have
    been bitten by them.`,
    unlocked: false, difficulty: 6, price: 70, feature: "Aggressive"},

    {fishId: "10", name: "Freshwater drum", sprite: "freshwaterdrum", spriteLocked: "freshwaterdrum-locked", activeTime: "Day",
    maxSize: 15, maxWeight: 10, rarityScore: 4,
    desc: `It is also called Russell fish, Shepherd's pie, Gray bass, Gasper goo,
    Gaspergou, Gou, Grunt, Grunter, Grinder, Gooble Gobble, and Croaker.
    The males make a "grunting" noise that comes from a special set of muscles
    that vibrate against the swim bladder. The purpose of the grunting is unknown.`,
    unlocked: false, difficulty: 3, price: 25, feature: "Grunting"},

    {fishId: "11", name: "Largemouth bass", sprite: "largemouthbass", spriteLocked: "largemouthbass-locked", activeTime: "Night",
    maxSize: 24, maxWeight: 11, rarityScore: 4, 
    desc: `Also known as swamp bass, this vigorous fish usually has a greenish coat of scales. It is the largest of the
    black basses genus and prefers habitats close to the shore with abundant vegetation. It is a voracious hunter,
    going after prey who can be as large as half of the bass' size. In some cases they go after even larger creatures`,  
    unlocked: false, difficulty: 5, price: 45, feature: ""},

    {fishId: "12", name: "Smallmouth bass", sprite: "smallmouthbass", spriteLocked: "smallmouthbass-locked", activeTime: "Night",
    maxSize: 16, maxWeight: 5, rarityScore: 3, 
    desc: `A brownish colored fish with ctenoid scales. It is an effective ambush predator due to it's striped camouflage pattern.
    The smallmouth prefers clearer waters and feeds on insects, amphibians and smaller fish.
    Adults cannibalize the young of other parents.`,
    unlocked: false, difficulty: 3, price: 30, feature: ""},

    {fishId: "13", name: "Catfish", sprite: "catfish", spriteLocked: "catfish-locked", activeTime: "Night",
    maxSize: 150, maxWeight: 97, rarityScore: 35, 
    desc: `These large bottom feeders are negatively buoyant and have a heavy, bony head. It likes to dig through the substrate.
    Catfish don't have scales, but some have bony plates. They posess an ability to taste anything they touch and "smell" chemicals
    in the water, the barbels are particularly sensitive. Some catfish don't posess eyes and rely entirely on other senses.`,  
    unlocked: false, difficulty: 9, price: 250, feature: ""},

    {fishId: "14", name: "Humpback chub", sprite: "humpbackchub", spriteLocked: "humpbackchub-locked", activeTime: "Day",
    maxSize: 27, maxWeight: 9, rarityScore: 4, 
    desc: `This resilient fish usually lives in the same local area for it's entire life, they have a concave head and a hump.`,
    unlocked: false, difficulty: 2, price: 20, feature: ""},

    {fishId: "15", name: "Walleye", sprite: "walleye", spriteLocked: "walleye-locked", activeTime: "Night",
    maxSize: 80, maxWeight: 10, rarityScore: 5, 
    desc: `Largely olive and gold color, its name comes from its pearlescent eyes that have an opaque appearance,
    they can see well in the dark and try to avoid bright lights.`,  
    unlocked: false, difficulty: 5, price: 65, feature: ""},

    {fishId: "16", name: "Bowfin", sprite: "bowfin", spriteLocked: "bowfin-locked", activeTime: "Day",
    maxSize: 50, maxWeight: 23, rarityScore: 3, 
    desc: `Like gars, bowfin have the capacity to breathe both water and air. Their skull is made of two layers and the outer
    part is made up of 28 fused bones and they have two sets of teeth. Bowfin are often referred to as "living fossils" due to
    retaining some characteristics of their ancestors. They can also adapt to warm, acidic waters.`,  
    unlocked: false, difficulty: 4, price: 45, feature: ""},

    {fishId: "17", name: "Starbass", sprite: "starbass", spriteLocked: "starbass-locked", activeTime: "Night",
    maxSize: 41, maxWeight: 19, rarityScore: 17, 
    desc: `A curious fish, it has some scales that catch the light.
    "Bet you haven't seen this fella before eh? It's a local specialty" - Shopkeeper`,  
    unlocked: false, difficulty: 6, price: 100, feature: ""},

    {fishId: "18", name: "Olly", sprite: "olly", spriteLocked: "olly-locked", activeTime: "Day",
    maxSize: 39, maxWeight: 18, rarityScore: 39, 
    desc: `You're not sure what sort of a fish this is, it looks pale though. 
    The shopkeeper could only scratch his head when you presented him this fish`,
    unlocked: false, difficulty: 9, price: 460, feature: "Unique"},

    {fishId: "19", name: "Shyfish", sprite: "shyfish", spriteLocked: "shyfish-locked", activeTime: "Night",
    maxSize: 18, maxWeight: 9, rarityScore: 42, 
    desc: `A small pale fish, it really seems to like bread. It has a long dark fins.
    The shopkeeper massaged his chin when you presented him this fish`,  
    unlocked: false, difficulty: 8, price: 550, feature: "Unique"},

    {fishId: "20", name: "Old Boot", sprite: "oldboot", spriteLocked: "oldboot-locked", activeTime: "Day",
    maxSize: 14, maxWeight: 9, rarityScore: 30, 
    desc: `Junk, maybe the shopkeeper will take pity on you and buy it for a coin.`,  
    unlocked: false, difficulty: 1, price: 4, feature: "plays failure sound"},

    {fishId: "21", name: "Beardy", sprite: "beardy", spriteLocked: "beardy-locked", activeTime: "Day",
    maxSize: 68, maxWeight: 40, rarityScore: 40, 
    desc: `You've heard tales of this crafty fish in the local area. 
    Despite it's size it has managed to outsmart the fishermen and has remained uncaught until now.
    It looks quite old and has many thin barbels around its head.
    "Is that what I think it is?! You actually managed to catch Ol'Beardy?!" - Shopkeeper`,
    unlocked: false, difficulty: 23, price: 770, feature: "Unique"},
    
];


