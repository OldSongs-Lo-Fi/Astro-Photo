// UPPER_PERS = persentile of light example, counts from end
// DOWN_PERS = persentile of dark example
// TOLERANCE = valid tolerance
// DARK_THRESHOLD = value from 0 to 1, explains the percentage of dark on image
const eventProcessor = require('./event_processor');
const hough = require('./hough');

const UPPER_PERS = 0.1;
const DOWN_PERS = 5;
const TOLERANCE = 0.08;
const DARK_THRESHOLD = 0.95;

const sharp = require("sharp");
const photoUtils = require("./photo_util");
const {onBadImage} = require("./event_processor");

async function determine(filepath){
    let image = sharp(filepath);

    let { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    console.log("\nProcessing: " + filepath);
    let dotsBright = getBrights(data, channels);
    let dotsBrightSorted = getBrights(data, channels).sort();

    let {darkTone, lightTone} = getTones(dotsBrightSorted);

    const toler = (lightTone - darkTone) * TOLERANCE;

    let darkDots = [];

    for (let i = 0; i < dotsBrightSorted.length; i++){
        if (dotsBrightSorted[i] < (darkTone + toler)){
            darkDots.push(dotsBrightSorted[i]);
        }
    }

    if(darkDots.length < dotsBrightSorted.length * DARK_THRESHOLD){
        eventProcessor.onBadImage("It was too bright!");
        return;
    }



    // SECOND PART OF FILTRATION.
    // SATELLITES CHECK

    let result = hough.testImage(dotsBright, lightTone, toler, width, height);

    if (result.founded){
        eventProcessor.onBadImage("I found SATELLITE on a photo. The line is: " + JSON.stringify(result.line));
        return;
    }



    eventProcessor.onGoodImage(`Image ${filepath} was good. I checked it!`)


}

function getBrights(data, channels){
    let dotsBright= [];

    for(let i = 0; i < data.length; i += channels){
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];

        dotsBright.push(photoUtils.getColorBrightness(red, green, blue));
    }

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
    determine,
    getTones,
    TOLERANCE
};