import kaplay from "kaplay";

const k = kaplay({
    width: 256,
    height: 192,
    letterbox: true,
    touchToMouse: true,
    scale: 20,
    pixelDensity: devicePixelRatio,
    debug: false,
    background: [0,0,0],
    global: false,
    maxFPS: 60,
});

export default k;


