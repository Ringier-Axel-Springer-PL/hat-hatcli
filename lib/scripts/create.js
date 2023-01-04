const fs = require("fs");
const child_process = require("child_process")
const AbstractScript = require("../AbstractScript");
const Utils = require("../Utils");

class Create extends AbstractScript {
    constructor() {
        super();
        this.projectName = process.argv.slice(2);
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
        // @TODO sprawdzic czy istnieje taki folder, jezli tak to wyjdz
        const args1 = [
            "clone",
            "ssh://git@stash.grupa.onet:7999/hat/hat-boilerplate.git",
            `${this.projectName}`
        ];
        child_process.spawnSync("git", args1);

        fs.rmSync(`./${this.projectName}/.git`, {recursive: true, force: true});
    }

    preparePackageJson() {
        try {
            const packageJson = Utils.getJsonFile(`./${this.projectName}/package.json`);

            packageJson.name = this.projectName;
            packageJson.version = "0.0.1";

            fs.unlinkSync(`./${this.projectName}/package.json`);
            fs.appendFileSync(`./${this.projectName}/package.json`, JSON.stringify(packageJson), 'utf8');
        } catch (e) {
            // @TODO error
        }
    }
    initGit() {
        const options = {cwd: this.cwd};
        child_process.spawnSync("git", ["init"], options);
        child_process.spawnSync("git", ["add", "-A"], options);
        child_process.spawnSync("git", ["commit", `-m Initialize project using Ringhat create`], options);
    }

    prepareProject() {
        const options = {cwd: this.cwd, stdio: 'inherit'};
        child_process.execSync('npm install', options);
        child_process.execSync('hat-cli setup', options);
        child_process.execSync('npm run dev', options);
    }
}

module.exports = Create;
