const {exec} = require("child_process");
const Utils = require("../Utils");
const AbstractScript = require("../AbstractScript");
class Start extends AbstractScript {
    constructor() {
        super();
    }

    async execute() {
        super.execute();
        this.loadEnvs();
        await this.createChildProcess();
    }

    loadEnvs() {
        const defaultConfiguration = this.loadedConfig?.profiles[this.actualProfile];

        Object.keys(defaultConfiguration).forEach((key) => {
            process.env[key] = defaultConfiguration[key];
            console.log(key, process.env[key])
        })
    }

    async createChildProcess() {
        const params = Utils.getArgumentsValue('--params');

        if (params) {
            const ls = exec(params.replaceAll('\\', ''), {env: process.env}, (error) => {
                if (error) {
                    console.log(error.stack);
                    console.log('Error code: ' + error.code);
                    console.log('Signal received: ' + error.signal);
                }
            });

            let lineBuffer = '';

            ls.stdout.on('data', (data) => {
                lineBuffer += data.toString();
                const lines = lineBuffer.split("\n");

                lines.forEach((line) => {
                    console.log(line);
                })

                lineBuffer = lines[lines.length - 1];
            });

            ls.on('exit', function (code) {
                console.log('Child process exited with exit code ' + code);
            });
        } else {
            // @TODO nie znaleziono arugumentu
        }
    }
}

module.exports = Start;
