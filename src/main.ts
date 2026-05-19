import { assetLoader } from "./assetLoader";
import k from "./kaplayCtx";
import { menu } from "./levels/menu";
import { day } from "./levels/day";
import { shop } from "./levels/shop";





//add life to the game, various animations and things going on
//look at those cool point and click fish cartoon games, they had the charm
//mb a crab in sand, and every level will have different details so
//at night theres some glowy bugs and such
//same goes for sounds
//make cursor sprite


// noticearea bug seems to be better now, test again in build mode and with resizing


// sound crackle and slowing down seems to occus consistantly when changing scenes fast and even when playing 
// the game normally if u reel in fish fast enough.
// this seems tied to browser single thread updates and sound stuff going out of sync with game code
// and is performance related, maybe allocations/deallocations and too many objects?
// framerate and other stuff stays fine, just sound gets bugged.

await assetLoader()


menu()

day()

shop()


// this addresses an issue where the hover/click areas drift to left from the ui element positions on the screen caused by
// flexbox set to true. It forces a resize causing the areas to update.
// test this in build mode and maybe other settings too like flexbox and like.
const canvas = document.querySelector("canvas");
    if (canvas) {
        canvas.style.width = (window.innerWidth - 1) + "px";

        setTimeout(() => {
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }


k.go("main-menu");



