const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function runWithTimeout(cmd, timeLimit = 2000){
  return new Promise((resolve, reject)=>{
    exec(cmd, {timeout: timeLimit, killSignal: 'SIGKILL'}, (err, stdout, stderr)=>{
      if(err){
        if(err.killed){
          return reject({type:"TLE", message: "Time Limit Exceeded"});
        }
        return reject({type: "RE", message: stderr.trim() || err.message});
      }
      resolve(stdout);
    })
  })
}

function runCode(filePath, language, input) {
  const baseName = path.basename(filePath, path.extname(filePath));
  let cmd;

  switch (language) {
    case 'cpp':
      cmd = `g++ ${filePath} -o ${path.join(outputDir, baseName)} && ${path.join(outputDir, baseName)} < ${input}`;
      break;

    case 'py':
      cmd = `python ${filePath} < ${input}`;
      break;

    default:
      return Promise.reject(`Unsupported language: ${language}`);
  }

  return runWithTimeout(cmd);
}
module.exports = runCode;
