const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Sign up form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// Sign up logic
router.post('/sign-up', async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return res.send('Username already taken!');
    }
    const user = new User(req.body);
    await user.save();
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Sign in form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

// Sign in logic
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send('Username not found!');
    }
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.send('Invalid password!');
    }
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Sign out
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
