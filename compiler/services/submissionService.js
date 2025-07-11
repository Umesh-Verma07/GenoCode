const axios = require('axios');
const { runCode } = require('./executionService');
const { deleteFile } = require('./fileService');

async function checkAndSubmit(filePath, code, language, problemId, email) {
  // fetch test data
  const { data } = await axios.get(`${process.env.DATABASE_SERVER}/problem/test/${problemId}`);

  if (!data.success) {
    deleteFile(filePath);
    throw { type: 'E', message: 'Could not load test cases' };
  }
  const { title, level } = data;
  // run each test
  try {
    for (let i = 0; i < data.testCases.length; i++) {
      const tc = data.testCases[i];
      const out = await runCode(filePath, language, tc.input);
      if (out.trim() !== tc.output.trim()) {
        throw { type: 'WA', message: `Wrong answer on test #${i + 1}` };
      }
    }
  } catch (e) {
    deleteFile(filePath);
    throw e;
  }
  deleteFile(filePath);
  try {
    const payload = { email, code, title, level, language };
    await axios.post(`${process.env.DATABASE_SERVER}/submit/${problemId}`, payload,
      {
        headers: { 'Content-Type': 'application/json' }
      });
    return 'Accepted';
  } catch (error) {
    throw { success: false, message: "Submission failed due to some internal error!" };
  }
}

module.exports = { checkAndSubmit };