const homedir = require('os').homedir();
const upath = require('upath');
const fs = require("fs");
const prompts = require("prompts");
const {exec} = require("child_process");
class Start {
    constructor() {
        this.configPath = `${upath.normalize(homedir)}/.hat`;
        this.actualRepoName = "";
        this.actualProfile = "";
        this.loadedConfig = {};
    }

    async execute() {
        this.loadConfig();
        this.readActualRepoName();
        await this.loadEnvs();
    }

    readActualRepoName() {
        if (!fs.existsSync("./package.json")) {
            throw new Error(`Missing package.json file. Please run command from project folder`);
        }
        let packageJson = null;
        try {
            packageJson = JSON.parse(fs.readFileSync("./package.json", 'utf8'));
        } catch (ex) {
            throw new Error(`Invalid /package.json content. Cannot parse JSON file.`);
        }

        this.actualRepoName = packageJson.name;
        this.actualProfile = this.loadedConfig?.repos[this.actualRepoName] || '';

        if (!this.actualProfile) {
            // @TODO: przypadek kiedy nie ma załaodwanego profilu: wybor swtórz nowy lub wybierz z istniejacych
        }
    }

    loadConfig() {
        console.info('Loading up profile configuration');

        if (!fs.existsSync(this.configPath)) {
            throw new Error(`Missing ${this.configPath} file.`);
        }

        let hatConfig = null;

        try {
            hatConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        } catch (ex) {
            throw new Error(`Invalid ${this.configPath} content. Cannot parse JSON file.`);
        }

        this.loadedConfig = hatConfig;
    }

    async loadEnvs() {
        const defaultConfiguration = this.loadedConfig?.profiles[this.actualProfile];

        Object.keys(defaultConfiguration).forEach((key) => {
            process.env[key] = defaultConfiguration[key];
            console.log(key, process.env[key])
        })

        const argumentName = '--params';
        let valueToReturn = '';

        process.argv.forEach((val) => {
            if (val.includes(argumentName)) {
                const argValue = val.split('=') || [];
                if (argValue.length >= 2 && argValue[0] === argumentName && argValue[1] !== '') {
                    valueToReturn = argValue[1];
                }
            }
        });

        valueToReturn = valueToReturn.replaceAll('\\', '');

        const { exec } = require('child_process');

        const ls = exec(valueToReturn, { env: process.env }, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
            }
        });
        var lineBuffer = "";
        ls.stdout.on('data', (data) => {
            lineBuffer += data.toString();
            var lines = lineBuffer.split("\n");
            for (var i = 0; i < lines.length - 1; i++) {
                var line = lines[i];
                console.log(line);
            }
            lineBuffer = lines[lines.length - 1];
        });

        ls.stderr.on('data', (data) => {
            console.error(data);
        });

        ls.on('exit', function (code) {
            console.log('Child process exited with exit code ' + code);
        });
    }
}

module.exports = Start;
