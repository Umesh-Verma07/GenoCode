module.exports = (err, req, res, next) => {
    console.error(err);

    const status =
        err.type === 'TLE' ? 408 :
        err.type === 'CE' ? 422 :
        err.type === 'RE' ? 400 :
        err.type === 'WA' ? 200 : 500;

    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
        ...(err.type ? { type: err.type } : {})
    });
};