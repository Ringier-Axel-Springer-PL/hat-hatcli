#! /usr/bin/env node

'use strict';
process.on('unhandledRejection', err => {
    throw err;
});

const args = process.argv.slice(2);
const script = args[0];
const nodeArgs = process.argv.slice(2);

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

if (['setup', 'start', 'create'].includes(script)) {
    handleScript(script);
} else {
    console.log('Unknown script "' + script + '".');
}
