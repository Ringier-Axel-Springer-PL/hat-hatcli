const fs = require("fs");
const child_process = require("child_process")
const AbstractScript = require("../AbstractScript");
const Utils = require("../Utils");

class Create extends AbstractScript {
    constructor(...args) {
        super(...args);
        this.projectName = process.argv.slice(2)[1];
        this.cwd = `${process.cwd()}/${this.projectName}`;
    }
    async execute() {
        super.execute();
        this.cloneAndPrepareRepository();
        this.preparePackageJson();
        this.initGit();
        this.prepareProject();
    }

    cloneAndPrepareRepository() {
        if (fs.existsSync(`./${this.projectName}`)) {
            throw new Error(`${this.projectName} already exists`);
        }

        child_process.spawnSync("git", ["clone",
            "https://github.com/ringpublishing/hat-boilerplate.git",
            `${this.projectName}`], { stdio: 'inherit'}
        );

        fs.rmSync(`./${this.projectName}/.git`, {recursive: true, force: true});
    }

    preparePackageJson() {
        const packageJson = Utils.getJsonFile(`./${this.projectName}/package.json`);

        packageJson.name = this.projectName;
        packageJson.version = "0.0.1";

        fs.unlinkSync(`./${this.projectName}/package.json`);
        fs.appendFileSync(`./${this.projectName}/package.json`, JSON.stringify(packageJson), 'utf8');
    }
    initGit() {
        const options = {cwd: this.cwd};
        child_process.spawnSync("git", ["init"], options);
        child_process.spawnSync("git", ["add", "-A"], options);
        child_process.spawnSync("git", ["commit", `-m Initialize project using Ringhat create`], options);
    }

    prepareProject() {
        const options = {cwd: this.cwd, stdio: 'inherit'};
        child_process.execSync('ringhat setup', options);
    }
}

module.exports = Create;
