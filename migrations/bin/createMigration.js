#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
const logger = require('@fizzygalacticus/colored-fancy-log');

const spawn = require('../lib/spawn');

const template = `
    'use strict';
    const {createMigrationFunctions} = require('../lib/migrate');
    module.exports = createMigrationFunctions('<FILE>');
`
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim()
    .concat('\n');

const fixMigration = async migration => {
    const output = await spawn(`npx db-migrate create ${migration} --config ${__dirname}/../config.js`);

    const [line] = output.split('\n');
    const filePath = line.split('Created migration at ')[1];

    const migrationName = path.basename(filePath).split('.')[0];
    const migrationTemplate = template.replace(/<FILE>/g, migrationName);

    await fs.writeFile(filePath, migrationTemplate);

    logger.success(output);
};

(async () => {
    if (process.argv.length > 2) {
        const migrations = process.argv.slice(2);

        await Promise.all(migrations.map(m => fixMigration(m)));
    } else {
        logger.error('you must pass in at least one migration name');
    }
})();
