const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// Index - Get all recipes for current user
router.get('/', async (req, res) => {
  try {
    const userRecipes = await Recipe.find({ owner: req.session.user._id });
    res.render('recipes/index.ejs', { recipes: userRecipes });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// New - Display form to add new recipe
router.get('/new', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.render('recipes/new.ejs', { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Create - Add new recipe
router.post('/', async (req, res) => {
  try {
    const ingredientIds = Array.isArray(req.body.ingredients)
      ? req.body.ingredients
      : req.body.ingredients
      ? [req.body.ingredients]
      : [];

    const newRecipe = new Recipe({
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: ingredientIds,
      owner: req.session.user._id,
    });

    await newRecipe.save();
    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Show - Display individual recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    res.render('recipes/show.ejs', { recipe });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Edit - Display form to edit recipe
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    const ingredients = await Ingredient.find();
    res.render('recipes/edit.ejs', { recipe, ingredients });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Update - Update existing recipe
router.put('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    // Access control check
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.send('Not authorized');
    }

    const ingredientIds = Array.isArray(req.body.ingredients)
      ? req.body.ingredients
      : req.body.ingredients
      ? [req.body.ingredients]
      : [];

    recipe.name = req.body.name;
    recipe.instructions = req.body.instructions;
    recipe.ingredients = ingredientIds;

    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Delete - Remove recipe
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    // Access control check
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.send('Not authorized');
    }

    await Recipe.deleteOne({ _id: req.params.recipeId });
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Delete multiple ingredients from recipe
router.delete('/:recipeId/ingredients', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    // Access control check
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.send('Not authorized');
    }

    const ingredientsToDelete = Array.isArray(req.body.ingredientIds) 
      ? req.body.ingredientIds 
      : [req.body.ingredientIds];
    
    recipe.ingredients = recipe.ingredients.filter(
      ing => !ingredientsToDelete.includes(ing._id.toString())
    );
    
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
