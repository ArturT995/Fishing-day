import { assetLoader } from "./assetLoader";
import k from "./kaplayCtx";
import { menu } from "./levels/menu";
import { day } from "./levels/day";



//call scenes here
//do bgs, shop,

//add life to the game, various animations and things going on
//look at those cool point and click fish cartoon games, they had the charm
//mb a crab in sand, and every level will have different details so
//at night theres some glowy bugs and such
//same goes for sounds
//make cursor sprite


//use tags more, you can seperate and reuse logic easier
//or group things by tag so they all have same onclick/onhover behavior

await assetLoader()

//make a function for doing repetetive ui onhover/onclick/properties 

menu()
//make a transition scene between menu and levels

day()
//night()

//Shop()

//Secret()

k.go("main-menu");



