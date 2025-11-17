function getColorBrightness(r, g, b) {
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;

    const luminance = 0.299 * normalizedR + 0.587 * normalizedG + 0.114 * normalizedB;

    return luminance;
}

function getPixelBrightness(dot) {
    return getColorBrightness(dot.r, dot.g, dot.b);
}

module.exports = {
    getPixelBrightness: getPixelBrightness,
    getColorBrightness: getColorBrightness
}