
//PERCENTAGE OF IMAGE DIAGONAL
const LINE_THRESHOLD = 0.5;
const ANGLE_STEP = 1;

function testImage(dotsBright, lightTone, tolerance, width, height){

    let diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    // 2D accumulator width x height
    let accumulator = [];
    for(let i = 0; i < 180; i++){
        accumulator[i] = Array(Math.floor(diagonal) * 2 + 1).fill(0);
    }


    //PERCENTAGE OF IMAGE WIDTH
    const maxLength = diagonal * LINE_THRESHOLD;
    for(let i = 0; i < dotsBright.length; i++){
        if(dotsBright[i] >= lightTone - tolerance){
            let x = i % width;
            let y= Math.floor(i / width);
            let lines = linesForPoint(x, y);

            for(let k = 0; k < lines.length; k++){
                // We have a data of line
                let line = lines[k];
                //We need to convert it to an array addresses, so we need just to adjust an offset to distance
                let score = accumulator[line.angle][Math.round(line.distance + diagonal)] += 1;

                if (score > maxLength){
                    // FOUND FIRST LINE AND RETURNED IT
                    return {
                        founded: true,
                        score: score,
                        line: line
                    };
                }
            }

        }
    }

    return {
        founded: false
    }

}


function linesForPoint(x, y){
    let lines = [];
    for (let i = 0; i < 180; i += ANGLE_STEP){
        let angleRad = i * (Math.PI / 180);
        let distance = x * Math.cos(angleRad) + y * Math.sin(angleRad);
        lines.push({angle: i, distance: distance})
    }
    return lines;
}


module.exports = {
    testImage: testImage
}