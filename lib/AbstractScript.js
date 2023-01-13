const homedir = require('os').homedir();
const upath = require('upath');
const Utils = require("./Utils");
const fs = require("fs");

class AbstractScript {
    constructor(scriptName) {
        this.configPath = `${upath.normalize(homedir)}/.hat`;
        this.actualRepoName = "";
        this.actualProfile = "";
        this.scriptName = scriptName;
        this.loadedConfig = {};
    }

    loadActualRepoName() {
        let packageJson = null;
        try {
            packageJson = Utils.getJsonFile("./package.json");
        } catch (e) {
            if(e.message.includes('Missing ./package.json file.')) {
                console.error('Try to run command from project folder');
                process.exit(0);
            } else {
                throw new Error(e)
            }
        }

        this.actualRepoName = packageJson.name;
    }

    loadActualProfile() {
        this.actualProfile = this.loadedConfig?.repos[this.actualRepoName] || '';
    }

    loadConfig() {
        let hatConfig = null;

        try {
            hatConfig = Utils.getJsonFile(this.configPath);
        } catch (e) {
            hatConfig = {
                repos: {},
                profiles: {}
            }
        }

        this.loadedConfig = hatConfig;
    }

    saveConfig() {
        if (fs.existsSync(this.configPath)) {
            fs.unlinkSync(this.configPath);
        }
        fs.appendFileSync(this.configPath, JSON.stringify(this.loadedConfig), 'utf8');

        console.log(`Config saved successfully`);
    }

    getProfileKeyForRepositoryName(repositoryName) {
        return this.loadedConfig?.repos[repositoryName];
    }

    execute() {
        this.loadConfig();
        if (this.scriptName !== 'create') {
            this.loadActualRepoName();
            this.loadActualProfile();
        }
    }
}

module.exports = AbstractScript;
