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
        let userExited = false;

        const choices = [{
            title: `Create new profile or edit existing one for '${this.actualRepoName}'`,
            value: "createProfile"
        }]

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
            }], { onCancel: () => {userExited = true} });

            if (!userExited) {
                this.loadedConfig.repos[this.actualRepoName] = selectedProfile.existingProfile;
                this.saveConfig();
            }
        } else if (options.userChoose === 'createProfile') {
            const profile = this.actualProfile;

            const options = await prompts([
                {
                    type: 'text',
                    name: 'profileName',
                    message: 'New profile name',
                    initial: profile ? profile : null
                }, {
                    type: 'text',
                    name: 'NEXT_PUBLIC_WEBSITE_DOMAIN',
                    message: 'Domain',
                    initial: profile ? this.loadedConfig.profiles[profile]?.NEXT_PUBLIC_WEBSITE_DOMAIN || this.loadedConfig.profiles[profile]?.WEBSITE_DOMAIN || null : null,
                    validate: (value) => {
                        if (!value.includes('http')) {
                            return 'Please, add http/https to the domain';
                        }
                        if (value[value.length - 1] === '/') {
                            return 'Please, remove / at the end of domain';
                        }
                        return true;
                    }
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_NAMESPACE_ID',
                    message: 'Namespace UUID',
                    initial: profile ? this.loadedConfig.profiles[profile]?.WEBSITE_API_NAMESPACE_ID || null : null
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_PUBLIC',
                    message: 'Website API public key',
                    initial: profile ? this.loadedConfig.profiles[profile]?.WEBSITE_API_PUBLIC || null : null
                }, {
                    type: 'text',
                    name: 'WEBSITE_API_SECRET',
                    message: 'Website API secret key',
                    initial: profile ? this.loadedConfig.profiles[profile]?.WEBSITE_API_SECRET || null : null
                }, {
                    type: 'text',
                    name: 'NEXT_PUBLIC_WEBSITE_API_VARIANT',
                    message: 'Variant name',
                    initial: profile ? this.loadedConfig.profiles[profile]?.NEXT_PUBLIC_WEBSITE_API_VARIANT || this.loadedConfig.profiles[profile]?.WEBSITE_API_VARIANT || null : null
                }, {
                    type: 'text',
                    name: 'OCDN_ACCESS_KEY_ID',
                    message: 'OCDN access key id',
                    initial: profile ? this.loadedConfig.profiles[profile]?.OCDN_ACCESS_KEY_ID || null : null
                }, {
                    type: 'text',
                    name: 'OCDN_SECRET_ACCESS_KEY',
                    message: 'OCDN secret access key id',
                    initial: profile ? this.loadedConfig.profiles[profile]?.OCDN_SECRET_ACCESS_KEY || null : null
                }, {
                    type: 'text',
                    name: 'NEXT_PUBLIC_OCDN_BUCKET_NAME',
                    message: 'OCDN bucket name',
                    initial: profile ? this.loadedConfig.profiles[profile]?.NEXT_PUBLIC_OCDN_BUCKET_NAME || this.loadedConfig.profiles[profile]?.OCDN_BUCKET_NAME || null : null
                }, {
                    type: 'text',
                    name: 'NEXT_PUBLIC_OCDN_TRANSFORM_KEY',
                    message: 'OCDN transform key',
                    initial: profile ? this.loadedConfig.profiles[profile]?.NEXT_PUBLIC_OCDN_TRANSFORM_KEY || this.loadedConfig.profiles[profile]?.OCDN_TRANSFORM_KEY || null : null
                }], { onCancel: () => {userExited = true} });

            if (!userExited) {
                this.loadedConfig.profiles[options.profileName] = {
                    "NEXT_PUBLIC_WEBSITE_DOMAIN": options.NEXT_PUBLIC_WEBSITE_DOMAIN,
                    "NEXT_PUBLIC_WEBSITE_API_VARIANT": options.NEXT_PUBLIC_WEBSITE_API_VARIANT,
                    "WEBSITE_API_NAMESPACE_ID": options.WEBSITE_API_NAMESPACE_ID,
                    "WEBSITE_API_PUBLIC": options.WEBSITE_API_PUBLIC,
                    "WEBSITE_API_SECRET": options.WEBSITE_API_SECRET,
                    "NEXT_PUBLIC_OCDN_BUCKET_NAME": options.NEXT_PUBLIC_OCDN_BUCKET_NAME,
                    "NEXT_PUBLIC_OCDN_TRANSFORM_KEY": options.NEXT_PUBLIC_OCDN_TRANSFORM_KEY,
                    "OCDN_ACCESS_KEY_ID": options.OCDN_ACCESS_KEY_ID,
                    "OCDN_SECRET_ACCESS_KEY": options.OCDN_SECRET_ACCESS_KEY,
                }

                this.loadedConfig.repos[this.actualRepoName] = options.profileName;
                this.saveConfig();
            }
        }
    }
}

module.exports = Setup;
