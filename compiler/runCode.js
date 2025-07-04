const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function runWithTimeout(cmd, input, timeLimit = 2000) {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, { timeout: timeLimit, killSignal: 'SIGKILL' }, (err, stdout, stderr) => {
      if (err) {
        if (err.killed) {
          return reject({ type: "TLE", message: "Time Limit Exceeded" });
        }
        return reject({ type: "RE", message: stderr.trim() || err.message });
      }
      resolve(stdout);
    })
    child.stdin.write(input);
    child.stdin.end();
  })
}

function runCode(filePath, language, input) {
  const baseName = path.basename(filePath, path.extname(filePath));
  let cmd;

  switch (language) {
    case 'cpp':
      cmd = `g++ ${filePath} -o ${path.join(outputDir, baseName)} && ${path.join(outputDir, baseName)}`;
      break;

    case 'py':
      cmd = `python ${filePath}`;
      break;

    case 'java':
      cmd = `javac -d ${outputDir} ${filePath} && java -cp ${outputDir} ${"Main"}`;
      break;

    case 'js':
      cmd = `node ${filePath}`;
      break;

    default:
      return Promise.reject(`Unsupported language: ${language}`);
  }
  return runWithTimeout(cmd, input);
}
module.exports = runCode;
