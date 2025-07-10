const Submission = require('../models/Submission');

exports.submit = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, code, title, language, level } = req.body;

    const sub = new Submission({ problemId: id, problemName: title, email, code, language, level });
    await sub.save();
    return res.json({ success: true, message: 'Problem submitted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

