#! /usr/bin/env node

'use strict';
process.on('unhandledRejection', err => {
    throw err;
});

const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
async function handleScript(script) {
    const scriptPath = './../lib/scripts/';

    try {
        const ScriptClass = require(`${scriptPath}${script}`);
        const scriptInstance = new ScriptClass();
        await scriptInstance.execute();

    } catch (error) {
        console.error(error.stack || error.message || error);
        process.exit(1); // exit with error status
    }
}

if (['setup', 'start'].includes(script)) {
    handleScript(script);
} else {
    console.log('Unknown script "' + script + '".');
}
