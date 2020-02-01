'use strict';

const { spawn } = require('child_process');

const exec = (cmdStr, { stdin = 'pipe', stdout = 'pipe', stderr = 'pipe' } = {}) =>
    new Promise((resolve, reject) => {
        const [cmd, ...args] = cmdStr.split(' ');

        const proc = spawn(cmd, args, { stdio: [stdin, stdout, stderr] });

        let output = '';
        let err = '';

        const onClose = code => {
            if (code !== 0) {
                reject(err);
            } else {
                resolve(output);
            }
        };

        if (proc.stdout) {
            proc.stdout.on('data', data => (output += data));
        }

        if (proc.stderr) {
            proc.stderr.on('data', data => (err += data));
        }

        proc.on('error', err => reject(err));
        proc.on('exit', onClose);
        proc.on('close', onClose);
    });

module.exports = exec;
