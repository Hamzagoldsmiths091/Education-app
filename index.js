const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const ejsLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Setup ejs as templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the public folder for static files (CSS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Use express-ejs-layouts for shared layouts
app.use(ejsLayouts);

// Home Route (this should be before other route handlers)
app.get('/', (req, res) => {
    res.render('index', { title: 'Education App', navbarClass: '', pageClass: '' }); // Load index.ejs and inject into layout.ejs
});

// Create a connection to MySQL using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Make the database connection available in other files
module.exports = db;

// Define routes for main pages:

// About page with custom navbar color (blue-navbar)
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us', navbarClass: 'blue-navbar', pageClass: 'about-page' });
});

// Add Course Route (Use add_course.ejs)
app.get('/course/add', (req, res) => {
    res.render('add_course', { title: 'Add New Course', navbarClass: 'blue-navbar', pageClass: 'add-course-page' });
});

// Search Courses Route (Use search_course.ejs)
app.get('/course/search', (req, res) => {
    res.render('search_course', { title: 'Search Courses', navbarClass: 'blue-navbar', pageClass: 'search-course-page' });
});

// Add the route for handling course-related operations
app.use('/course', require('./routes/course'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
