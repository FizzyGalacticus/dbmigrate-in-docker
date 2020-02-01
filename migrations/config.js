'use strict';

const envs = {
    production: ['prod', 'production'],
    stage: ['stage'],
    test: ['test', 'testing', 'ci'],
    developtment: ['dev', 'development'],
};

const env = Object.entries(envs).reduce((acc, [key, values]) => {
    const env = values.find(v => v === (process.env.NODE_ENV || '').toLowerCase());

    if (env) {
        acc = key;
    }

    return acc;
}, 'development');

const getEnvVar = name => process.env[name];

const defaultConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    schema: 'public',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
};

const getDatabaseConfig = () => {
    const baseConfig = {
        [env]: {
            driver: 'pg',
        },
        'sql-file': true,
    };

    let envConfig;

    switch (env) {
        case 'development':
            envConfig = {
                development: defaultConfig,
                'sql-file': true,
            };
            break;
        case 'test':
        case 'stage':
        case 'production':
            envConfig = {
                production: {
                    host: getEnvVar('DB_HOST') || defaultConfig.host,
                    database: getEnvVar('DB_NAME') || defaultConfig.database,
                    user: getEnvVar('DB_USER'),
                    password: getEnvVar('DB_PASS'),
                    schema: getEnvVar('DB_SCHEMA') || defaultConfig.schema,
                    port: getEnvVar('DB_PORT') || defaultConfig.port,
                    ssl: true,
                },
                'sql-file': true,
            };
            break;
        default:
            throw new Error('invalid environment');
    }

    return { ...baseConfig, ...envConfig, [env]: { ...baseConfig[env], ...envConfig[env] } };
};

module.exports = getDatabaseConfig();

if (require.main === module) {
    console.log(getDatabaseConfig());
}
