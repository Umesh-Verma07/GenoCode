const asyncHandler = require('../middlewares/asyncHandler');
const { writeCodeToFile } = require('../services/fileService');
const { generateAIReview } = require('../services/reviewService');
const { deleteFile } = require('../services/fileService');
const { runQueue, submitQueue } = require('../config/queue');

exports.run = asyncHandler(async (req, res) => {
    const { code, language, input } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    const file = writeCodeToFile(code, language);
    const job = await runQueue.add({ file, language, input });
    
    let result;
    try {
        result = await job.finished();
    } catch (err) {
        deleteFile(file);
        return res.status(err.type === 'TLE' ? 408 : 400).json({ success: false, ...err });
    }
    deleteFile(file);
    res.json({ success: true, output: result.stdout });
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

    const job = await submitQueue.add({ file, code, language, problemId, email });

    try {
        const verdict = await job.finished();
        deleteFile(file);
        return res.json({ success: true, verdict });
    } catch (err) {
        deleteFile(file);
        const status = err.type === 'WA' ? 200 : (err.type === 'TLE' ? 408 : 400);
        return res.status(status).json({ success: false, ...err });
    }
});