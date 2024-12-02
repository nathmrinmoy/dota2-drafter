class TeamAnalysisService {
  calculateTeamBalance(team) {
    return {
      physicalDamage: this.calculateDamageDistribution(team, 'physical'),
      magicalDamage: this.calculateDamageDistribution(team, 'magical'),
      roleDistribution: this.calculateRoleDistribution(team),
      laneDistribution: this.calculateLaneDistribution(team)
    };
  }

  calculateDamageDistribution(team, type) {
    const damageCount = team.filter(hero => hero?.damageType === type).length;
    return (damageCount / Math.max(team.length, 1)) * 100;
  }

  calculateRoleDistribution(team) {
    const roles = {
      CARRY: 0,
      SUPPORT: 0,
      INITIATOR: 0,
      DURABLE: 0,
      NUKER: 0,
      DISABLER: 0,
      ESCAPE: 0,
      PUSHER: 0
    };

    team.forEach(hero => {
      if (hero?.roles) {
        hero.roles.forEach(role => {
          if (roles.hasOwnProperty(role)) {
            roles[role]++;
          }
        });
      }
    });

    return roles;
  }

  calculateLaneDistribution(team) {
    const lanes = {
      SAFELANE: 0,
      MIDLANE: 0,
      OFFLANE: 0,
      JUNGLE: 0,
      ROAMING: 0
    };

    team.forEach(hero => {
      if (hero?.preferredLane) {
        lanes[hero.preferredLane]++;
      }
    });

    return lanes;
  }

  needsInitiation(team) {
    return !team.some(hero => hero?.roles?.includes('INITIATOR'));
  }

  needsLateGame(team) {
    return !team.some(hero => hero?.roles?.includes('CARRY'));
  }

  needsDisable(team) {
    return !team.some(hero => hero?.roles?.includes('DISABLER'));
  }

  needsTankiness(team) {
    return !team.some(hero => hero?.roles?.includes('DURABLE'));
  }

  getMissingRoles(roleDistribution) {
    const missingRoles = [];
    for (const [role, count] of Object.entries(roleDistribution)) {
      if (count === 0) {
        missingRoles.push(role);
      }
    }
    return missingRoles;
  }

  identifyTeamArchetype(team) {
    // Return team strategy type: 'push', 'teamfight', 'pickoff', 'lategame', etc.
    const roles = team.map(hero => hero?.roles || []).flat();
    // Analysis logic here
  }

  getTeamNeeds(team) {
    const balance = this.calculateTeamBalance(team);
    return {
      needsInitiation: this.needsInitiation(team),
      needsLateGame: this.needsLateGame(team),
      needsDisable: this.needsDisable(team),
      needsTankiness: this.needsTankiness(team),
      missingRoles: this.getMissingRoles(team)
    };
  }

  // Helper functions for hero scoring
  getAvailableHeroes(allHeroes, allyTeam, enemyTeam) {
    return allHeroes.filter(hero => 
      !allyTeam.some(h => h?.id === hero.id) &&
      !enemyTeam.some(h => h?.id === hero.id)
    );
  }

  calculateSynergyScore(hero, allyHeroes) {
    let score = 0;
    allyHeroes.forEach(ally => {
      if (hero.synergies?.includes(ally.id)) {
        score += 15;
      }
    });
    return score;
  }

  calculateCounterScore(hero, enemyHeroes) {
    let score = 0;
    enemyHeroes.forEach(enemy => {
      if (hero.counters?.includes(enemy.id)) {
        score += 20;
      }
    });
    return score;
  }

  calculateLaneScore(hero, selectedLane) {
    if (!selectedLane) return 50;
    return hero.lanePresence?.[selectedLane] || 50;
  }

  calculateTeamNeedsScore(hero, teamNeeds) {
    let score = 0;
    if (teamNeeds.needsInitiation && hero.hasInitiation) score += 20;
    if (teamNeeds.needsLateGame && hero.isLateGame) score += 20;
    if (teamNeeds.needsDisable && hero.hasDisable) score += 20;
    if (teamNeeds.needsTankiness && hero.isTanky) score += 20;
    return score;
  }

  calculateRoleBalanceScore(hero, teamBalance) {
    const neededRoles = this.getMissingRoles(teamBalance.roleDistribution);
    return hero.roles?.some(role => neededRoles.includes(role)) ? 100 : 50;
  }

  calculateDamageTypeScore(hero, teamBalance) {
    const damageType = hero.damageType || 'physical';
    if (teamBalance.physicalDamage > teamBalance.magicalDamage) {
      return damageType === 'magical' ? 100 : 50;
    }
    return damageType === 'physical' ? 100 : 50;
  }

  calculateWinRateScore(hero, enemyHeroes) {
    const baseWinRate = hero.winRates?.overall || 50;
    let totalScore = baseWinRate;
    let count = 1;

    enemyHeroes.forEach(enemy => {
      if (enemy && hero.winRates?.vsHero) {
        totalScore += hero.winRates.vsHero[enemy.id] || 50;
        count++;
      }
    });

    return totalScore / count;
  }

  calculateArchetypeCompatibility(hero, teamArchetype) {
    if (!teamArchetype) return 50;

    const archetypeScores = {
      push: hero.pushPower || 0,
      teamfight: hero.teamfightPower || 0,
      pickoff: hero.pickoffPower || 0,
      lategame: hero.lateGamePower || 0
    };

    return archetypeScores[teamArchetype] || 50;
  }
}

// Export a singleton instance
export const teamAnalysisService = new TeamAnalysisService(); 