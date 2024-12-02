import { openDotaService } from './openDotaService';

class ValidationService {
  constructor() {
    this.heroStats = null;
    this.matchCache = new Map();
  }

  async initialize() {
    this.heroStats = await openDotaService.fetchHeroStats();
  }

  async validateSuggestions(matchCount = 100) {
    if (!this.heroStats) await this.initialize();
    
    const matches = await openDotaService.fetchProMatches(matchCount);
    let results = {
      totalMatches: 0,
      correctPredictions: 0,
      roleAccuracy: 0,
      synergyAccuracy: 0,
      counterAccuracy: 0
    };

    for (const match of matches) {
      const details = await this.getMatchDetails(match.match_id);
      if (!details.picks_bans) continue;

      // Get draft order
      const picks = details.picks_bans
        .filter(pb => pb.is_pick)
        .sort((a, b) => a.order - b.order);

      // For each team's last pick
      for (const team of [0, 1]) {
        const teamPicks = picks.filter(p => p.team === team);
        if (teamPicks.length < 5) continue;

        // Get first 4 picks
        const partialDraft = teamPicks.slice(0, 4).map(p => p.hero_id);
        const actualLastPick = teamPicks[4].hero_id;

        // Get our suggestions
        const suggestions = this.getSuggestedHeroes(
          partialDraft,
          picks.filter(p => p.team !== team).map(p => p.hero_id)
        );

        // Validate suggestion
        const validation = this.validateSuggestion(
          suggestions[0],
          actualLastPick,
          details
        );

        results.totalMatches++;
        results.correctPredictions += validation.isCorrect ? 1 : 0;
        results.roleAccuracy += validation.roleScore;
        results.synergyAccuracy += validation.synergyScore;
        results.counterAccuracy += validation.counterScore;
      }
    }

    // Calculate averages
    results.accuracy = (results.correctPredictions / results.totalMatches) * 100;
    results.roleAccuracy /= results.totalMatches;
    results.synergyAccuracy /= results.totalMatches;
    results.counterAccuracy /= results.totalMatches;

    return results;
  }

  validateSuggestion(suggestion, actualPick, matchDetails) {
    const suggestionHero = this.heroStats.find(h => h.id === suggestion);
    const actualHero = this.heroStats.find(h => h.id === actualPick);

    return {
      isCorrect: suggestion === actualPick,
      roleScore: this.calculateRoleMatchScore(suggestionHero, actualHero),
      synergyScore: this.calculateSynergyScore(suggestion, matchDetails),
      counterScore: this.calculateCounterScore(suggestion, matchDetails)
    };
  }

  async getMatchDetails(matchId) {
    if (!this.matchCache.has(matchId)) {
      const details = await openDotaService.fetchMatchDetails(matchId);
      this.matchCache.set(matchId, details);
    }
    return this.matchCache.get(matchId);
  }

  calculateRoleMatchScore(suggestionHero, actualHero) {
    if (!suggestionHero || !actualHero) return 0;
    
    const roleMatch = suggestionHero.roles.some(role => 
      actualHero.roles.includes(role)
    );
    
    const primaryRoleMatch = suggestionHero.roles[0] === actualHero.roles[0];
    
    return roleMatch ? (primaryRoleMatch ? 100 : 70) : 0;
  }

  calculateSynergyScore(suggestion, matchDetails) {
    const team = matchDetails.picks_bans
      .filter(pb => pb.team === matchDetails.radiant_team)
      .map(pb => pb.hero_id);

    const synergies = this.heroStats.find(h => h.id === suggestion)?.synergies || [];
    const synergyCount = team.filter(id => synergies.includes(id)).length;

    return (synergyCount / team.length) * 100;
  }

  calculateCounterScore(suggestion, matchDetails) {
    const enemyTeam = matchDetails.picks_bans
      .filter(pb => pb.team !== matchDetails.radiant_team)
      .map(pb => pb.hero_id);

    const counters = this.heroStats.find(h => h.id === suggestion)?.counters || [];
    const counterCount = enemyTeam.filter(id => counters.includes(id)).length;

    return (counterCount / enemyTeam.length) * 100;
  }

  async calculateWinRate(heroId, matchDetails) {
    // Get last 100 pro matches with this hero
    const matches = await this.fetchHeroMatches(heroId, 100);
    
    const similarMatches = matches.filter(m => 
      this.isSimilarDraft(m, matchDetails)
    );

    if (similarMatches.length === 0) return 50;

    const wins = similarMatches.filter(m => m.radiant_win === (m.radiant_team === heroId)).length;
    return (wins / similarMatches.length) * 100;
  }

  isSimilarDraft(match1, match2) {
    // Compare team compositions
    const rolesSimilarity = this.compareRoles(match1, match2);
    const timingsSimilarity = this.compareTimings(match1, match2);
    const countersSimilarity = this.compareCounters(match1, match2);

    return (rolesSimilarity + timingsSimilarity + countersSimilarity) / 3 > 0.7;
  }
}

export const validationService = new ValidationService(); 