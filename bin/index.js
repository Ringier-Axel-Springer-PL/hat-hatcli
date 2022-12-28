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

if (['setup'].includes(script)) {
    console.log('Work in progress...')
} else {
    console.log('Unknown script "' + script + '".');
}
