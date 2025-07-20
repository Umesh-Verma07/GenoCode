const { spawn } = require('child_process');
const path = require('path');
const { deleteFile } = require('./fileService');

function runCode(filePath, language, input, timeLimit = 3000) {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const dir = path.dirname(filePath);

    return new Promise((resolve, reject) => {
        let cleanup = [];

        const startTime = Date.now();
        let output = '';
        let errorOutput = '';

        const executeProgram = (execCmd, execArgs) => {
            const runProcess = spawn(execCmd, execArgs);

            const timeoutId = setTimeout(() => {
                runProcess.kill('SIGKILL');
            }, 5000);

            runProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            runProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            runProcess.on('close', (code) => {
                clearTimeout(timeoutId);
                cleanup.forEach(deleteFile);

                const execTime = Date.now() - startTime;

                if (execTime > timeLimit) {
                    return reject({ type: 'TLE', message: `Time limit exceeded (${execTime}ms)` });
                }

                if (code !== 0) {
                    return reject({ type: 'RE', message: errorOutput.trim() || `Exited with code ${code}` });
                }

                resolve(output.trim());
            });

            runProcess.on('error', (err) => {
                clearTimeout(timeoutId);
                cleanup.forEach(deleteFile);
                reject({ type: 'RE', message: err.message });
            });

            if (input) {
                runProcess.stdin.write(input);
                runProcess.stdin.end();
            }
        };

        if (language === 'cpp') {
            const outPath = `${dir}/${base}.out`;
            cleanup.push(outPath);

            const compile = spawn('g++', [filePath, '-o', outPath]);

            compile.stderr.on('data', data => errorOutput += data.toString());

            compile.on('close', (code) => {
                if (code !== 0) {
                    cleanup.forEach(deleteFile);
                    return reject({ type: 'CE', message: errorOutput.trim() });
                }
                executeProgram(outPath, []);
            });

        } else if (language === 'java') {
            const compile = spawn('javac', ['-d', dir, filePath]);
            cleanup.push(`${dir}/Main.class`);

            compile.stderr.on('data', data => errorOutput += data.toString());

            compile.on('close', (code) => {
                if (code !== 0) {
                    cleanup.forEach(deleteFile);
                    return reject({ type: 'CE', message: errorOutput.trim() });
                }
                // Run 'java -cp dir Main'
                executeProgram('java', ['-cp', dir, 'Main']);
            });

        } else if (language === 'py') {
            executeProgram('python', [filePath]);

        } else if (language === 'js') {
            executeProgram('node', [filePath]);

        } else {
            reject({ type: 'CE', message: `Unsupported language: ${language}` });
        }
    });
}

module.exports = { runCode };
