const { exec } = require('child_process');
const path = require('path');
const { deleteFile } = require('./fileService');

function runCode(filePath, language, input, timeLimit = 2000) {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    let cmd;
    const cleanup = [];
    switch (language) {
        case 'cpp':
            cleanup.push(`${dir}/${base}.out`);
            cmd = `g++ "${filePath}" -o "${dir}/${base}.out" && "${dir}/${base}.out"`;
            break;
        case 'py':
            cmd = `python "${filePath}"`;
            break;
        case 'js':
            cmd = `node "${filePath}"`;
            break;
        case 'java':
            // compile to .class then run
            cleanup.push(`${dir}/Main.class`);
            cmd = `javac -d ${dir} ${filePath} && java -cp ${dir} ${"Main"}`;
            break;
        default:
            throw { type: 'CE', message: `Unsupported language: ${language}`};
    }

    return new Promise((resolve, reject) => {
        const child = exec(cmd, { timeout: timeLimit, killSignal: 'SIGKILL' }, (err, stdout, stderr) => {
            // cleanup source + binaries
            cleanup.forEach(deleteFile);
            if (err) {
                if (err.killed) return reject({ type: 'TLE', message: 'Time limit exceeded' });
                return reject({ type: 'RE', message: stderr.trim() || err.message });
            }
            resolve(stdout);
        });

        if (input) {
            child.stdin.write(input);
            child.stdin.end();
        }
    });
}

module.exports = { runCode };