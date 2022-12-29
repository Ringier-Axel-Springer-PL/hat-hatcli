const homedir = require('os').homedir();
const upath = require('upath');
const fs = require("fs");
const prompts = require("prompts");

class Setup {
    constructor() {
        this.configPath = `${upath.normalize(homedir)}/.hat`;
        this.actualRepoName = "";
        this.actualProfile = "";
        this.loadedConfig = {};
    }

    async execute() {
        this.loadConfig();
        this.readActualRepoName();
        await this.chooseNamespace();
    }

    readActualRepoName() {
        if (!fs.existsSync("./package.json")) {
            throw new Error(`Missing package.json file. Please run command from project folder`);
        }
        let packageJson = null;
        try {
            packageJson = JSON.parse(fs.readFileSync("./package.json", 'utf8'));
        } catch (ex) {
            throw new Error(`Invalid ${this.configPath} content. Cannot parse JSON file.`);
        }

        this.actualRepoName = packageJson.name;
        this.actualProfile = this.loadedConfig?.repos[this.actualRepoName] || '';

        if (!this.actualProfile) {
            // @TODO: przypadek kiedy nie ma załaodwanego profilu: wybor swtórz nowy lub wybierz z istniejacych
        }
    }

    loadConfig() {
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

        // const themeName = this.themeJson.theme;
        //
        // if (!hatConfig || !ucsConfig[themeName]) {
        //     throw new Error(`Missing theme configuration for "${themeName}" theme.  Please run "hat-cli setup"`);
        // }
    }

    async chooseNamespace() {
        const validate = value => !!value;
        const defaultConfiguration = this.loadedConfig?.profiles[this.actualProfile]
        const allProfiles = this.loadedConfig?.profiles || {};
        // let typeNamespaceIdManually = true;

        const options = await prompts([{
            type: 'select',
            name: 'userChoose',
            message: `What do you want to do?`,
            choices: [{
                title: `Create new profile for '${this.actualRepoName}'`,
                value: "createProfile"
            }, {
                title: `Change selected '${this.loadedConfig?.repos[this.actualRepoName]}' profile to another existing one`,
                value: "loadProfile"
            }]
        }]);

        if (options.userChoose === 'loadProfile') {
            const selectedProfile = await prompts([{
                type: 'select',
                name: 'existingProfile',
                message: `Which profile you want to use for '${this.actualRepoName}'`,
                choices: Object.keys(allProfiles).map((key) => {
                    return {
                        value: key,
                        title: key
                    }
                })
            }]);

            this.loadedConfig.repos[this.actualRepoName] = selectedProfile.existingProfile;

            if (fs.existsSync(this.configPath)) {
                fs.unlinkSync(this.configPath);
            }
            fs.appendFileSync(this.configPath, JSON.stringify(this.loadedConfig), 'utf8');
        } else if (options.userChoose === 'createProfile') {
                const options = await prompts([
                {
                    type: 'text',
                    name: 'profileName',
                    message: 'New profile name',
                    initial: ''
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_NAMESPACE_ID',
                    message: 'Namespace UUID',
                    initial: ''
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_PUBLIC',
                    message: 'Website API public',
                    initial: ''
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_SECRET',
                    message: 'Website API secret',
                    initial: ''
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_DOMAIN',
                    message: 'Domain',
                    initial: 'https://demo-ring.com/'
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_VARIANT',
                    message: 'Variant name',
                    initial: 'ALL_FEATURES_BACKUP'
                }
            ]);

            this.loadedConfig.profiles[options.profileName] = {
                "WEBSITE_API_NAMESPACE_ID": options.WEBSITE_API_NAMESPACE_ID,
                "WEBSITE_API_PUBLIC": options.WEBSITE_API_PUBLIC,
                "WEBSITE_API_SECRET": options.WEBSITE_API_SECRET,
                "WEBSITE_API_DOMAIN": options.WEBSITE_API_DOMAIN,
                "WEBSITE_API_VARIANT": options.WEBSITE_API_VARIANT,
            }

            this.loadedConfig.repos[this.actualRepoName] = options.profileName;

            if (fs.existsSync(this.configPath)) {
                fs.unlinkSync(this.configPath);
            }
            fs.appendFileSync(this.configPath, JSON.stringify(this.loadedConfig), 'utf8');
        }
    }
}

module.exports = Setup;
