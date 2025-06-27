const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function executeCode(filePath, language) {
  const baseName = path.basename(filePath, path.extname(filePath));
  let cmd;

  switch (language) {
    case 'cpp':
      cmd = `g++ "${filePath}" -o "${path.join(outputDir, baseName)}" && "${path.join(outputDir, baseName)}"`;
      break;

    case 'py':
      cmd = `python "${filePath}"`;
      break;

    default:
      return Promise.reject({ error: `Unsupported language: ${language}` });
  }

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject({ error: stderr || err.message });
      }
      resolve({ stdout });
    });
  });
}

module.exports = executeCode;
