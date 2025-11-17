const model = require("./utils/ml_model");
const FOLDER_NAME = "images";
const fs = require("fs");
main();

function main() {

    const files = fs.readdirSync(`./${FOLDER_NAME}`);
    for (const file of files) {
        model.determine(`./${FOLDER_NAME}/${file}`)
            .catch((e) => {
                console.error(e);
            });
    }

}
