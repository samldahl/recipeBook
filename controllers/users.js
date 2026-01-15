const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// Index - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username email');
    res.render('users/index.ejs', { users });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Show - Display specific user's recipes
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username email');
    const userRecipes = await Recipe.find({ owner: req.params.userId });
    res.render('users/show.ejs', { user, recipes: userRecipes });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
