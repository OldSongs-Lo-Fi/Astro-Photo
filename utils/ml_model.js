// UPPER_PERS = persentile of light example, counts from end
// DOWN_PERS = persentile of dark example
// TOLERANCE = valid tolerance
// DARK_THRESHOLD = value from 0 to 1, explains the percentage of dark on image

const UPPER_PERS = 0.1;
const DOWN_PERS = 5;
const TOLERANCE = 0.08;
const DARK_THRESHOLD = 0.95;

const sharp = require("sharp");
const photoUtils = require("./photo_util");

async function determine(filepath){
    let image = sharp(filepath);

    let { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    console.log("Processing: " + filepath);
    let dotsBright = getBrights(data, channels);

    let {darkTone, lightTone} = getTones(dotsBright);

    const toler = (lightTone - darkTone) * TOLERANCE;

    let darkDots = [];

    for (let i = 0; i < dotsBright.length; i++){
        if (dotsBright[i] < (darkTone + toler)){
            darkDots.push(dotsBright[i]);
        }
    }

    if(darkDots.length > dotsBright.length * DARK_THRESHOLD){
        console.log("CLEAR IMAGE");
    }
    else {
        console.log("BAD IMAGE");
    }
    console.log();

}

function getBrights(data, channels){
    let dotsBright= [];

    for(let i = 0; i < data.length; i += channels){
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];

        dotsBright.push(photoUtils.getColorBrightness(red, green, blue));
    }

    dotsBright.sort();

    return dotsBright;
}


function getTones(dotsBright){
    const darkTone = dotsBright[Math.floor((dotsBright.length / 100) * DOWN_PERS)];
    console.log("Dark tone: " +darkTone);
    const lightTone = dotsBright[dotsBright.length - 1 - Math.floor((dotsBright.length / 100) * UPPER_PERS)];
    console.log("Light tone: " +lightTone);

    return {darkTone, lightTone};
}
module.exports = {
    determine
};