import kaplay from "kaplay";

const k = kaplay({
    width: 256,
    height: 192,
    letterbox: true, // dynamic scaling
    touchToMouse: true,
    scale: 4,
    pixelDensity: devicePixelRatio,
    debug: true, // set to false in prod.
    background: [0,0,0],
    global: false,
});

export default k;

