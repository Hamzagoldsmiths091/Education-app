const express = require('express');
const router = express.Router();
const db = require('../index');  // Import the database connection

// Route to render the form to add a new course
router.get('/add', (req, res) => {
    // Render the form with no message initially
    res.render('add_course', { 
        title: 'Add a Course', 
        message: null, 
        messageType: null,
        pageClass: 'add-course-page',
        navbarClass: 'navbar-add-course',
        course_name: '', // Empty course name on page load
        user_id: '' // Empty user ID on page load
    });
});

// Route to handle form submission for adding a new course
router.post('/add', (req, res) => {
    const { course_name, user_id } = req.body;

    // Server-side validation for user_id between 1 and 2
    if (user_id < 1 || user_id > 2) {
        return res.render('add_course', { 
            title: 'Add a Course',
            message: 'User ID must be between 1 and 2',  // Error message if validation fails
            messageType: 'error',
            course_name,  // Preserve the input values after validation failure
            user_id
        });
    }

    // Insert course into the database
    const query = 'INSERT INTO courses (course_name, user_id) VALUES (?, ?)';
    db.query(query, [course_name, user_id], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.render('add_course', { 
                title: 'Add a Course',
                message: 'Error adding course',  // Error message if insertion fails
                messageType: 'error',
                course_name,  // Preserve the input values if insertion fails
                user_id
            });
        } else {
            return res.render('add_course', { 
                title: 'Add a Course',
                message: 'Course added successfully',  // Success message if insertion succeeds
                messageType: 'success',
                course_name: '',  // Clear the input fields after successful submission
                user_id: ''  // Clear the input fields after successful submission
            });
        }
    });
});

// Route to render the search form
router.get('/search', (req, res) => {
    res.render('search_course', { title: 'Search for Courses' });  // Passing title for layout
});

// Route to handle the search query using POST method
router.post('/search', (req, res) => {
    const { course_name } = req.body;

    // Query the database for matching courses
    const query = 'SELECT * FROM courses WHERE course_name LIKE ?';
    db.query(query, [`%${course_name}%`], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error searching for courses');
        } else {
            res.render('search_results', { courses: results, search: course_name, title: 'Search Results' });
        }
    });
});

// Route to handle the search query using GET method (optional if you'd like search results directly from URL)
router.get('/search/:course_name', (req, res) => {
    const { course_name } = req.params;

    // Query the database for matching courses
    const query = 'SELECT * FROM courses WHERE course_name LIKE ?';
    db.query(query, [`%${course_name}%`], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error searching for courses');
        } else {
            res.render('search_results', { courses: results, search: course_name, title: 'Search Results' });
        }
    });
});

module.exports = router;
