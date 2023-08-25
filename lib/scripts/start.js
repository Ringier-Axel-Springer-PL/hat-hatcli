const {exec} = require("child_process");
const Utils = require("../Utils");
const AbstractScript = require("../AbstractScript");
class Start extends AbstractScript {
    constructor(...args) {
        super(...args);
    }

    async execute() {
        super.execute();
        this.loadEnvs();
        await this.createChildProcess();
    }

    loadEnvs() {
        const defaultConfiguration = this.loadedConfig?.profiles[this.actualProfile];

        if (defaultConfiguration) {
            Object.keys(defaultConfiguration).forEach((key) => {
                process.env[key] = defaultConfiguration[key];
                console.log(key, process.env[key])
            })
        } else {
            throw new Error(`Profile not found for this project: ${this.actualRepoName}, run 'ringhat setup' to setup profile`)
        }
    }

    async createChildProcess() {
        const params = Utils.getArgumentsValue('--params');

        if (params) {
            const ls = exec(params.replace(new RegExp(`\\\\`, 'g'), ''), {env: process.env}, (error) => {
                if (error) {
                    console.log(error.stack);
                    console.log('Error code: ' + error.code);
                    console.log('Signal received: ' + error.signal);
                }
            });

            let lineBuffer = '';
            let errLineBuffer = '';

            ls.stdout.on('data', (data) => {
                lineBuffer += data.toString();
                const lines = lineBuffer.split("\n");

                lines.forEach((line) => {
                    if (line !== '') {
                        console.log(line);
                    }
                })

                lineBuffer = lines[lines.length - 1];
            });

            ls.stderr.on('data', (data) => {
                errLineBuffer += data.toString();
                const lines = errLineBuffer.split("\n");

                lines.forEach((line) => {
                    if (line !== '') {
                        console.log(line);
                    }
                })

                errLineBuffer = lines[lines.length - 1];
            });

            ls.on('exit', function (code) {
                console.log('Child process exited with exit code ' + code);
            });
        } else {
            throw new Error(`Missing '--params' argument`)
        }
    }
}

module.exports = Start;
