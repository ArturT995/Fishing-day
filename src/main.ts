import { assetLoader } from "./assetLoader";
import k from "./kaplayCtx";
import { menu } from "./levels/menu";
import { day } from "./levels/day";
import { shop } from "./levels/shop";
import { sleepScene } from "./levels/sleepScene";
import { endScene } from "./levels/endScene";


await assetLoader()


menu()

day()

shop()

sleepScene()

endScene()


// this addresses an issue where in dev mode the hover/click areas drift to left from the ui element positions on the screen caused by
// flexbox set to true. It forces a resize causing the areas to update.
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



