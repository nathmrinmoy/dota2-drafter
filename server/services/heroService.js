const Hero = require('../models/hero.model');

class HeroService {
  // Calculate how well a hero counters the enemy team
  calculateCounterScore(hero, enemyTeam) {
    let score = 0;
    let reasons = [];

    enemyTeam.forEach(enemyHero => {
      if (!enemyHero) return;
      
      if (hero.counters.includes(enemyHero.id)) {
        score += 20;
        reasons.push(`Counters ${enemyHero.name}`);
      }
    });

    return { score, reasons };
  }

  // Calculate how well a hero synergizes with ally team
  calculateSynergyScore(hero, allyTeam) {
    let score = 0;
    let reasons = [];

    allyTeam.forEach(allyHero => {
      if (!allyHero) return;
      
      if (hero.synergies.includes(allyHero.id)) {
        score += 15;
        reasons.push(`Synergizes with ${allyHero.name}`);
      }
    });

    return { score, reasons };
  }

  // Calculate lane suitability
  calculateLaneScore(hero, lane) {
    let score = 0;
    let reasons = [];

    if (hero.lanes.includes(lane)) {
      score += 25;
      reasons.push(`Strong ${lane} hero`);
    }

    return { score, reasons };
  }

  async getSuggestions(allyTeam, enemyTeam, lane) {
    try {
      const allHeroes = await Hero.find();
      
      const suggestions = allHeroes
        .map(hero => {
          // Skip heroes already picked
          if (allyTeam.some(h => h?.id === hero.id) || 
              enemyTeam.some(h => h?.id === hero.id)) {
            return null;
          }

          const counterAnalysis = this.calculateCounterScore(hero, enemyTeam);
          const synergyAnalysis = this.calculateSynergyScore(hero, allyTeam);
          const laneAnalysis = this.calculateLaneScore(hero, lane);

          const totalScore = counterAnalysis.score + 
                           synergyAnalysis.score + 
                           laneAnalysis.score;

          const confidence = Math.min(Math.round(totalScore / 1.2), 100);

          return {
            id: hero.id,
            name: hero.name,
            confidence,
            reasons: [
              ...counterAnalysis.reasons,
              ...synergyAnalysis.reasons,
              ...laneAnalysis.reasons
            ]
          };
        })
        .filter(suggestion => suggestion !== null)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8); // Return top 8 suggestions

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }
}

module.exports = new HeroService(); 