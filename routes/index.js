const express = require('express');
const router = express.Router();

// Route for the home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Home - Education App' });
});

module.exports = router;
