const homedir = require('os').homedir();
const upath = require('upath');
const Utils = require("./Utils");
const fs = require("fs");

class AbstractScript {
    constructor() {
        this.configPath = `${upath.normalize(homedir)}/.hat`;
        this.actualRepoName = "";
        this.actualProfile = "";
        this.loadedConfig = {};
    }

    loadActualRepoName() {
        let packageJson = null;
        try {
            packageJson = Utils.getJsonFile("./package.json");
        } catch (e) {
            console.error(e);
        }

        this.actualRepoName = packageJson.name;
    }

    loadActualProfile() {
        this.actualProfile = this.loadedConfig?.repos[this.actualRepoName] || '';

        if (!this.actualProfile) {
            // @TODO: przypadek kiedy nie ma załaodwanego profilu: wybor swtórz nowy lub wybierz z istniejacych
        }
    }

    loadConfig() {
        let hatConfig = null;

        try {
            hatConfig = Utils.getJsonFile(this.configPath);
        } catch (e) {
            console.error(e);
        }

        this.loadedConfig = hatConfig;
    }

    saveConfig() {
        if (fs.existsSync(this.configPath)) {
            fs.unlinkSync(this.configPath);
        }
        fs.appendFileSync(this.configPath, JSON.stringify(this.loadedConfig), 'utf8');
    }

    getProfileKeyForRepositoryName(repositoryName) {
        return this.loadedConfig?.repos[repositoryName];
    }

    execute() {
        this.loadConfig();
        this.loadActualRepoName();
        this.loadActualProfile();
    }
}

module.exports = AbstractScript;
