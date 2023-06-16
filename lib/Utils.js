const homedir = require('os').homedir();
const upath = require('upath');
const fs = require("fs");
const prompts = require("prompts");
const npmCheck = require('npm-check');

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

                if (argValue[0] === argumentName && argValue[1] !== '') {
                    if (argValue.length >= 2 ){
                        // nested params
                        argValue.shift();
                        valueToReturn = argValue.join('=');
                    } else {
                        valueToReturn = argValue[1];
                    }
                }
            }
        });

        return valueToReturn;
    }
    static async checkVersion() {
        const filePath = `${upath.normalize(homedir)}/.hat`;
        let shouldCheck = false;

        try {
            const config = Utils.getJsonFile(filePath);
            const actualTime = new Date();

            if (config.lastCheck) {
                const lastCheck = new Date(config.lastCheck);
                const day = 1000 * 60 * 60 * 24;
                const nextDay = actualTime.getTime() + day;

                if (lastCheck.getTime() - nextDay > 0) {
                    config.lastCheck = actualTime.getTime();
                    shouldCheck = true;
                }
            } else {
                config.lastCheck = actualTime.getTime();
                shouldCheck = true;
            }

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            fs.appendFileSync(filePath, JSON.stringify(config), 'utf8');
        } catch (e) {
            if (!e.message.includes('Missing')) {
               console.warn(`Couldn't read last package check`);
            }
        }

        if (shouldCheck) {
            const originalConsoleLog = console.log;
            console.log = () => {
            }; // To hide logs printed by npmCheck

            try {
                const currentState = await npmCheck({global: true, ignore: ["[!ringhat]*"]});
                const packages = currentState.get('packages');
                const ringhat = packages.find(el => el.moduleName === 'ringhat');

                if (ringhat && typeof ringhat.latest !== 'undefined' && ringhat.installed !== ringhat.latest) {
                    console.warn('Out of date version of ringhat package, please update:');
                    console.warn('npm install --global ringhat@latest');
                }
            } catch (error) {
                console.warn('Unable to check ringhat package version, reason:');
                console.warn(error.message);
            }
            console.log = originalConsoleLog;
        }
    }
}

module.exports = Utils;
