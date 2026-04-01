const asyncHandler = require('../middlewares/asyncHandler');
const { enqueueTask } = require('../services/jobQueue');

exports.run = asyncHandler(async (req, res) => {
    const { code, language, input } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    try {
        const result = await enqueueTask('run', { code, language, input });
        res.json({ success: true, output: result.output });
    } catch (err) {
        const payload = { success: false, error: err.message || String(err), ...(err.type ? { type: err.type } : {})};
        const status = err.type === 'TLE' ? 408 : 400;
        return res.status(status).json(payload);
    }
});

exports.review = asyncHandler(async (req, res) => {
    const { code, problem } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    try {
        const result = await enqueueTask('review', { code, problem });
        return res.json({ success: true, text: result.text });
    } catch (err) {
        const status = err.statusCode || err.status || 502;
        return res.status(status).json({
            success: false,
            error: err.message || 'Failed to generate AI review.'
        });
    }
});

exports.submit = asyncHandler(async (req, res) => {
    const { code, language, problemId, email } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Empty code body' });

    try {
        const result = await enqueueTask('submit', { code, language, problemId, email });
        return res.json({ success: true, verdict: result.verdict });
    } catch (err) {
        const status = err.type === 'WA' ? 200 : (err.type === 'TLE' ? 408 : 400);
        const payload = { success: false, error: err.message || String(err), ...(err.type ? { type: err.type } : {})};
        return res.status(status).json(payload);
    }
});