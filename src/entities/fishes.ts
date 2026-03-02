



export interface FishObj {
    id: number;
    name: string;
    size: number;
    sprite: string;
    desc: string;
    unlocked: boolean;
}

export const FISH_DATA = [
    {id: 0, name: "Orange Fish", sprite: "orangefishIcon",
    desc: "A common freshwater denizen.", avgSize: 12, unlocked: false},
    {id: 1, name: "Bluemer", sprite: "bluefishIcon",
    desc: "Strikingly blue.", avgSize: 7, unlocked: true},
    {id: 2, name: "Bluemer", sprite: "bluefishIcon",
    desc: "Strikingly blue.", avgSize: 7, unlocked: true},
    {id: 3, name: "Bluemer", sprite: "bluefishIcon",
    desc: "Strikingly blue.", avgSize: 7, unlocked: true},
    {id: 4, name: "Bluemer", sprite: "bluefishIcon",
    desc: "Strikingly blue.", avgSize: 7, unlocked: true},
    {id: 5, name: "Orange Fish", sprite: "orangefishIcon",
    desc: "A common freshwater denizen.", avgSize: 12, unlocked: false},
    {id: 6, name: "Orange Fish", sprite: "orangefishIcon",
    desc: "A common freshwater denizen.", avgSize: 12, unlocked: false},
];