const auth = require('../middleware/auth');

// User routes
router.get('/dashboard', auth('user'), (req, res) => {
    // User dashboard logic
}); 