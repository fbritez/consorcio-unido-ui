const { spawn } = require('child_process');

const port = process.argv[2] || '3000';
const reactScriptsBin = require.resolve('react-scripts/bin/react-scripts.js');

const child = spawn(
    process.execPath,
    [reactScriptsBin, 'start'],
    {
        stdio: 'inherit',
        env: { ...process.env, PORT: port },
    }
);

child.on('exit', code => process.exit(code));
