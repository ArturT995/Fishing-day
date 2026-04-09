import fs from 'fs';
import path from 'path';



const soundDir = './public/sounds';
const fishDir = './public/graphics/fishes';

const soundFiles = fs.readdirSync(soundDir)
    .filter(file => file.endsWith('.mp3'))
    .map(file => path.parse(file).name);

const FishFiles = fs.readdirSync(fishDir)
    .filter(file => file.endsWith('.png'))
    .map(file => path.parse(file).name);

console.log(JSON.stringify(FishFiles, null, 2));

