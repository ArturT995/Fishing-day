## Fishing Day

My first game, catch fish, buy items and upgrade rods until you can afford boat keys to travel out to the sea. Built with [Kaplay](https://kaplayjs.com/) and TypeScript/Vite.

You can play it in desktop browser here(or view screenshots and read more about the game's features): https://arturt995.itch.io/fishing-day


Install and run it in your CLI with(Linux/WSL example):
\`\`\`bash
git clone https://github.com/ArturT995/Fishing-day
cd Fishing-day
npm install
npm run dev
\`\`\`


### About & Contributing

After doing the guided Boot.dev courses I wanted to do a short game project, but It ended up becoming longer and I spent a couple months on it as a side project. Currently the code still needs to be cleaned up and refactored in parts. Some types need to be defined as well.


Important files:
* src/main.ts - Scenes are loaded here, also I leave some TODO notes there at times.
* src/db.ts  - The database of the game, descriptions and info about items and fish is stored and added here.
* src/gm.ts - Global gamestate manager, handles saves and has various flags and stats.
* assetLoader.ts - Loads in various sounds, fonts and sprites, I've made some helper functions there to speed things up as well as src/gen.js to read and print folder data. The assets are stored in public folder.
* src/sounds.ts - Managed the sfx and sounds in the game, every time a sound is called in the code it goes through here.
* src/ui.ts - Various UI helper functions here for icon arrays, sliders, text effects. There is a helper for alignment that is a bit buggy due to how updates are handled, but it's used by sliders and works for them so I've kept it.
* src/bag.ts - handles item effects and rod selection
* src/messages.ts - handles in game messages
* src/fishing.ts - handles fishing logic and difficulty
* src/entities/fishes.ts - handles fish generation, characteristics and behaviour


Contributions and fixes are welcome, test locally and open up a pull request for review if you have any additions you wish to make.
