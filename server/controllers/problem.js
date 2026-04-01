const Problem = require('../models/Problem');

// List all problems
exports.listProblems = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '15', 10), 1), 100);
    const skip = (page - 1) * limit;
    const cursor = req.query.cursor || null;

    const search = (req.query.search || '').trim();
    const level = (req.query.level || 'All').trim();
    const sort = req.query.sort || 'newest';

    const query = {};
    if (level !== 'All') {
      query.level = level;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const sortMap = {
      newest: { date: -1 },
      oldest: { date: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 },
    };
    const sortQuery = sortMap[sort] || sortMap.newest;

    // Cursor mode is optimized for large datasets in infinite-scroll use cases.
    if (cursor && (sort === 'newest' || sort === 'oldest')) {
      const [cursorDateRaw, cursorId] = String(cursor).split('|');
      const cursorDate = cursorDateRaw ? new Date(cursorDateRaw) : null;
      if (cursorDate && !Number.isNaN(cursorDate.getTime()) && cursorId) {
        if (sort === 'newest') {
          query.$or = [
            { date: { $lt: cursorDate } },
            { date: cursorDate, _id: { $lt: cursorId } },
          ];
        } else {
          query.$or = [
            { date: { $gt: cursorDate } },
            { date: cursorDate, _id: { $gt: cursorId } },
          ];
        }
      }

      const problem = await Problem.find(query)
        .sort({ ...sortQuery, _id: sort === 'oldest' ? 1 : -1 })
        .limit(limit)
        .select('_id title level date');

      const lastItem = problem[problem.length - 1];
      const nextCursor = lastItem ? `${new Date(lastItem.date).toISOString()}|${lastItem._id}` : null;

      return res.json({
        success: true,
        problem,
        limit,
        nextCursor,
        hasNextPage: problem.length === limit,
        mode: 'cursor',
      });
    }

    const [problem, total] = await Promise.all([
      Problem.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select('_id title level date'),
      Problem.countDocuments(query),
    ]);

    return res.json({
      success: true,
      problem,
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasNextPage: skip + problem.length < total,
      hasPrevPage: page > 1,
    });
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

