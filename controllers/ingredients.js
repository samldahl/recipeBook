const express = require('express');
const router = express.Router();

const Ingredient = require('../models/ingredient.js');

// Index - Get all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.render('ingredients/index.ejs', { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Create - Add new ingredient
router.post('/', async (req, res) => {
  try {
    const existingIngredient = await Ingredient.findOne({ name: req.body.name });
    if (existingIngredient) {
      // For AJAX requests, return JSON
      if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        return res.status(400).json({ error: 'Ingredient already exists' });
      }
      return res.redirect('/ingredients');
    }
    const newIngredient = new Ingredient(req.body);
    await newIngredient.save();
    
    // For AJAX requests, return JSON
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      return res.json({ success: true, ingredient: newIngredient });
    }
    res.redirect('/ingredients');
  } catch (error) {
    console.log(error);
    // For AJAX requests, return JSON
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      return res.status(500).json({ error: 'Failed to create ingredient' });
    }
    res.redirect('/');
  }
});

module.exports = router;
