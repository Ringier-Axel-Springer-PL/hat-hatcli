const homedir = require('os').homedir();
const upath = require('upath');
const fs = require("fs");
const prompts = require("prompts");

class Utils {
    static getJsonFile(path) {
        if (!fs.existsSync(path)) {
            throw new Error(`Missing ${path} file.`);
        }
        let jsonFile = null;
        try {
            jsonFile = JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (ex) {
            throw new Error(`Invalid ${path} content. Cannot parse JSON file.`);
        }
        return jsonFile;
    }

    static getArgumentsValue(argumentName) {
        let valueToReturn = null;

        process.argv.forEach((val) => {
            if (val.includes(argumentName)) {
                const argValue = val.split('=') || [];

                if (argValue.length >= 2 && argValue[0] === argumentName && argValue[1] !== '') {
                    valueToReturn = argValue[1];
                }
            }
        });

        return valueToReturn;
    }
}

module.exports = Utils;
