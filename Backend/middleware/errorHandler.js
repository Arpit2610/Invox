const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler; 