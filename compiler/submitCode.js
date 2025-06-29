const fs = require('fs');
const path = require('path');
const axios = require('axios')
const generateInputFile = require('./generateInputFile');
const { exec } = require('child_process');
const { stdout } = require('process');

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function submitCode(filePath, code, language, problemId, email) {
  const baseName = path.basename(filePath, path.extname(filePath));

  try {
    const res = await axios.get(`${process.env.DATABASE_SERVER}/problem/test/${problemId}`);
    const data = res.data;
    if (!data.success) {
      return res.status(400).json({ success: false, error: "TEST CASES NOT FOUND" });
    }
    const testCases = data.testCases;

    return new Promise(async (resolve, reject)=>{
      
      testCases.map((test, index) => {
        const input = generateInputFile(test.input);
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

        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            return reject({ error: stderr || err.message });
          }
          if (test.output !== stdout) {
            console.log(stdout);
            throw new Error(`Wrong answer on test ${index + 1}`);
          }
        });
      })

      const payload = {email, code, title: data.title};
      const res = await axios.post(`${process.env.DATABASE_SERVER}/submit/${problemId}`,
         payload,
        {
          headers: { 'Content-Type': 'application/json' }
        });

      if(!res.data.success){
        res.status(400).json({success : false, error: "Submission Failed"});
      }
      return resolve({stdout: "Accepted"});
    })

  } catch (error) {
    return res.status(400).json({ success: false, error});
  }
}

module.exports = submitCode;