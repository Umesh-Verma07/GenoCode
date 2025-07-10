const Problem = require('../models/Problem');

// List all problems
exports.listProblems = async (req, res) => {
  try {
    const problem = await Problem.find({});
    return res.json({ success: true, problem });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


// Create a new problem
exports.createProblem = async (req, res) => {
  try {
    // Only admins can create problems
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admins only' });
    }

    const { title, description, level, testCases, email } = req.body;
    if (!title || !description || !level || !testCases || !email) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newProblem = new Problem({ title, description, level, testCases, email });
    await newProblem.save();
    return res.json({ success: true, message: 'Problem created successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Update existing problem
exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, level, testCases } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    // Only creator can update
    if (problem.email !== req.user.email) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Only creator allowed' });
    }

    // Apply updates
    problem.title = title;
    problem.description = description;
    problem.level = level;
    problem.testCases = testCases;
    await problem.save();

    return res.json({ success: true, message: 'Problem updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }

    // Only creator can delete
    if (problem.email !== email) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Only creator allowed' });
    }

    await Problem.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Problem deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Get all testcases for a problem
exports.getTestCases = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    return res.json({ success: true, testCases: problem.testCases, title: problem.title, level: problem.level });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// Get detail of a problem
exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    // Return only first test case for detail
    const detail = {
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      level: problem.level,
      testCases: [problem.testCases[0]],
      email: problem.email,
    };
    return res.json({ success: true, problem: detail });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

