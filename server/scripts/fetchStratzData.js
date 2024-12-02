const mongoose = require('mongoose');
const axios = require('axios');
const Hero = require('../models/hero.model');
require('dotenv').config();

const STRATZ_API_URL = 'https://api.stratz.com/api/v1';
const STRATZ_API_KEY = process.env.STRATZ_API_KEY;

const stratzClient = axios.create({
  baseURL: STRATZ_API_URL,
  headers: {
    'Authorization': `Bearer ${STRATZ_API_KEY}`
  }
});

async function fetchHeroData() {
  try {
    // Fetch basic hero data
    const heroesResponse = await stratzClient.get('/Hero');
    const heroes = Object.values(heroesResponse.data);

    // For each hero, fetch matchups and lane stats
    const heroData = await Promise.all(heroes.map(async hero => {
      const [matchups, laneStats] = await Promise.all([
        stratzClient.get(`/Hero/${hero.id}/matchup`),
        stratzClient.get(`/Hero/${hero.id}/laneStats`)
      ]);

      return {
        id: hero.id,
        name: hero.displayName,
        shortName: hero.shortName,
        primaryAttribute: hero.primaryAttribute,
        roles: hero.roles,
        imageUrl: `https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_full.png`,
        iconUrl: `https://cdn.stratz.com/images/dota2/heroes/${hero.shortName}_icon.png`,
        matchups: matchups.data,
        laneStats: laneStats.data,
        // Convert matchups into counters and synergies based on advantage values
        counters: matchups.data
          .filter(m => m.advantage < -2)
          .map(m => m.vsHeroId),
        synergies: matchups.data
          .filter(m => m.advantage > 2)
          .map(m => m.vsHeroId),
        lanes: Object.entries(laneStats.data)
          .filter(([_, stats]) => stats.presence > 0.1)
          .map(([lane]) => lane)
      };
    }));

    // Connect to MongoDB and update heroes
    await mongoose.connect(process.env.MONGODB_URI);
    await Hero.deleteMany({});
    await Hero.insertMany(heroData);

    console.log('Successfully updated hero data from Stratz!');
    process.exit(0);
  } catch (error) {
    console.error('Error fetching data from Stratz:', error);
    process.exit(1);
  }
}

fetchHeroData(); 