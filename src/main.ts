import { assetLoader } from "./assetLoader";
import k from "./kaplayCtx";
import { menuScene } from "./levels/menu";
import { morningScene } from "./levels/morning";



//call scenes here
//do bgs, shop,

//add life to the game, various animations and things going on
//look at those cool point and click fish cartoon games, they had the charm
//mb a crab in sand, and every level will have different details so
//at night theres some glowy bugs and such
//same goes for sounds


await assetLoader()

menuScene()
morningScene()

k.go("main-menu");



