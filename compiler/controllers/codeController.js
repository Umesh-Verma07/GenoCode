const asyncHandler = require('../middlewares/asyncHandler');
const { writeCodeToFile } = require('../services/fileService');
const generateAIReview = require('../services/reviewService');
const { deleteFile } = require('../services/fileService');
const { runCode } = require('../services/executionService');
const { checkAndSubmit } = require('../services/submissionService');

exports.run = asyncHandler(async (req, res) => {
    const { code, language, input } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    const file = writeCodeToFile(code, language);
    try {
        const stdout = await runCode(file, language, input);
        deleteFile(file);
        res.json({ success: true, output: stdout });
    } catch (err) {
        deleteFile(file);
        const payload = { success: false, error: err.message || String(err), ...(err.type ? { type: err.type } : {})};
        const status = err.type === 'TLE' ? 408 : 400;
        return res.status(status).json(payload);
    }
});

exports.review = asyncHandler(async (req, res) => {
    const { code, problem } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    const text = await generateAIReview(code, problem);
    res.json({ success: true, text });
});

exports.submit = asyncHandler(async (req, res) => {
    const { code, language, problemId, email } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    const file = writeCodeToFile(code, language);
    try {
        const verdict = await checkAndSubmit(file, code, language, problemId, email);
        deleteFile(file);
        return res.json({ success: true, verdict });
    } catch (err) {
        deleteFile(file);
        const status = err.type === 'WA' ? 200 : (err.type === 'TLE' ? 408 : 400);
        const payload = { success: false, error: err.message || String(err), ...(err.type ? { type: err.type } : {})};
        return res.status(status).json(payload);
    }
});