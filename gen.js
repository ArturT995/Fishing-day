import fs from 'fs';
import path from 'path';



const soundDir = './public/sounds';
const fishDir = './public/graphics/fishes';
const itemDir = './public/graphics/items';


const soundFiles = fs.readdirSync(soundDir)
    .filter(file => file.endsWith('.mp3'))
    .map(file => path.parse(file).name);

const FishFiles = fs.readdirSync(fishDir)
    .filter(file => file.endsWith('.png'))
    .map(file => path.parse(file).name);

const ItemFiles = fs.readdirSync(itemDir)
    .filter(file => file.endsWith('.png'))
    .map(file => path.parse(file).name);


function generate(names) {
    if (names === "fishes") {
        console.log(JSON.stringify(FishFiles, null, 2));
    }
    if (names === "items") {
        console.log(JSON.stringify(ItemFiles, null, 2));
    }
    if (names === "sounds") {
        console.log(JSON.stringify(soundFiles, null, 2));
    }

}


generate("fishes")