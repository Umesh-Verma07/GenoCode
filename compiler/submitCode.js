const fs = require('fs')
const path = require('path')
const axios = require('axios')
const runCode = require('./runCode')

const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function submitCode(filePath, code, language, problemId, email) {
  const res = await axios.get(`${process.env.DATABASE_SERVER}/problem/test/${problemId}`);
  const { success, testCases = [], level, title } = res.data;
  if (!success) {
    throw { success: false, error: "Could not load test cases" };
  }

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    let stdout;
    try {
      stdout = await runCode(filePath, language, tc.input);
    } catch (e) {
      if (e.type === 'TLE' || e.type === 'RE') throw e;
      throw { type: 'CE', message: e.message || String(e) };
    }
    if (stdout.trim() !== tc.output.trim()) {
      throw { type: 'WA', message: `Wrong Answer on test #${i + 1}`, expected: tc.output, actual: stdout };
    }
  }
  try {
    const payload = { email, code, title, level, language };
    await axios.post(`${process.env.DATABASE_SERVER}/submit/${problemId}`, payload,
      {
        headers: { 'Content-Type': 'application/json' }
      });
    return { success: true, verdict: 'AC', message: 'Accepted' };
  } catch (error) {
    throw { success: false, message: "Submission failed due to some internal error!" };
  }
}

module.exports = submitCode;