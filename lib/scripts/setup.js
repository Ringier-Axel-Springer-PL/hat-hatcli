const prompts = require("prompts");
const AbstractScript = require("../AbstractScript");

class Setup extends AbstractScript {
    constructor(...args) {
        super(...args);
    }

    async execute() {
        super.execute();
        await this.chooseNamespace();
    }

    async chooseNamespace() {
        const allProfiles = this.loadedConfig?.profiles || {};

        const choices = [{
            title: `Create new profile for '${this.actualRepoName}'`,
            value: "createProfile"
        }]

        const profileKey = this.getProfileKeyForRepositoryName(this.actualRepoName);
        if (Object.keys(this.loadedConfig.profiles).length > 0) {
            choices.push({
                title: `Select an existing profile for '${this.actualRepoName}'`,
                value: "loadProfile"
            })
        }

        const options = await prompts([{
            type: 'select',
            name: 'userChoose',
            message: `What do you want to do?`,
            choices
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
            this.saveConfig();
        } else if (options.userChoose === 'createProfile') {
                const options = await prompts([
                {
                    type: 'text',
                    name: 'profileName',
                    message: 'New profile name',
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_NAMESPACE_ID',
                    message: 'Namespace UUID',
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_PUBLIC',
                    message: 'Website API public',
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_SECRET',
                    message: 'Website API secret',
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_DOMAIN',
                    message: 'Domain',
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_VARIANT',
                    message: 'Variant name',
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
            this.saveConfig();
        }
    }
}

module.exports = Setup;
