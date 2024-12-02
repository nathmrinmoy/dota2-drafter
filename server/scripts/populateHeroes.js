const mongoose = require('mongoose');
const Hero = require('../models/hero.model');
require('dotenv').config();

// Sample hero data - you would expand this with actual Dota 2 hero data
const heroData = [
  {
    id: 1,
    name: 'Anti-Mage',
    primaryAttribute: 'Agility',
    roles: ['Carry', 'Escape'],
    counters: [2, 5, 8], // IDs of heroes this hero counters
    synergies: [3, 6, 9], // IDs of heroes this hero works well with
    lanes: ['safe']
  },
  {
    id: 2,
    name: 'Crystal Maiden',
    primaryAttribute: 'Intelligence',
    roles: ['Support', 'Disabler', 'Nuker'],
    counters: [4, 7],
    synergies: [1, 5],
    lanes: ['support']
  },
  // Add more heroes...
];

async function populateHeroes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing heroes
    await Hero.deleteMany({});
    
    // Insert new heroes
    await Hero.insertMany(heroData);
    
    console.log('Database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateHeroes(); 