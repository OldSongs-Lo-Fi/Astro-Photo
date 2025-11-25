function onError(message){
    console.log("### ERROR ###")
    console.log(message);
}


function onGoodImage(message){
    console.log("### GOOD ###")
    console.log(message);
}


function onBadImage(message){
    console.log("### BAD ###")
    console.log(message);
}



module.exports = {
    onError,
    onGoodImage,
    onBadImage,
}