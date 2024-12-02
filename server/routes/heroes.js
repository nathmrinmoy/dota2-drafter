const router = require('express').Router();
let Hero = require('../models/hero.model');
const heroService = require('../services/heroService');

router.route('/').get((req, res) => {
  Hero.find()
    .then(heroes => res.json(heroes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/suggestions').post(async (req, res) => {
  const { allyTeam, enemyTeam, lane } = req.body;
  
  try {
    const suggestions = await heroService.getSuggestions(allyTeam, enemyTeam, lane);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error getting suggestions' });
  }
});

module.exports = router; 