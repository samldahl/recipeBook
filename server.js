require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.log('MongoDB connection error:', error);
});

// Import middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Import controllers
const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');
const usersController = require('./controllers/users.js');

// Apply middleware to all routes
app.use(passUserToView);

// Home route
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Routes
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);
app.use('/users', usersController);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
