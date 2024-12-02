import { teamAnalysisService } from '../teamAnalysisService';

describe('Team Analysis Service Tests', () => {
  test('Scenario 1: Need for Initiator', () => {
    const team = [
      { id: 1, name: "Anti-Mage", roles: ["CARRY"], damageType: "physical" },
      { id: 2, name: "Sniper", roles: ["CARRY"], damageType: "physical" },
      { id: 3, name: "Crystal Maiden", roles: ["SUPPORT"], damageType: "magical" }
    ];

    const needs = teamAnalysisService.getTeamNeeds(team);
    expect(needs.needsInitiation).toBe(true);
    expect(needs.needsTankiness).toBe(true);

    const balance = teamAnalysisService.calculateTeamBalance(team);
    expect(balance.physicalDamage).toBeGreaterThan(balance.magicalDamage);
  });

  test('Scenario 2: Counter Picks', () => {
    const hero = {
      id: 10,
      name: "Lion",
      roles: ["SUPPORT", "DISABLER"],
      counters: [4, 5] // Counters Storm and AM
    };

    const enemyTeam = [
      { id: 4, name: "Storm Spirit" },
      { id: 5, name: "Anti-Mage" }
    ];

    const counterScore = teamAnalysisService.calculateCounterScore(hero, enemyTeam);
    expect(counterScore).toBe(40); // 20 points per counter
  });

  test('Scenario 3: Synergy', () => {
    const hero = {
      id: 7,
      name: "Phantom Assassin",
      roles: ["CARRY"],
      synergies: [6] // Synergizes with Magnus
    };

    const allyTeam = [
      { id: 6, name: "Magnus" }
    ];

    const synergyScore = teamAnalysisService.calculateSynergyScore(hero, allyTeam);
    expect(synergyScore).toBe(15); // 15 points for synergy
  });

  test('Scenario 4: Full Suggestion Flow', () => {
    const allHeroes = [
      { id: 1, name: "Anti-Mage", roles: ["CARRY"], damageType: "physical" },
      { id: 2, name: "Axe", roles: ["INITIATOR", "DURABLE"], damageType: "physical" },
      { id: 3, name: "Crystal Maiden", roles: ["SUPPORT"], damageType: "magical" },
      { id: 4, name: "Lion", roles: ["SUPPORT", "DISABLER"], damageType: "magical" },
      { id: 5, name: "Magnus", roles: ["INITIATOR"], damageType: "magical" }
    ];

    const allyTeam = [
      { id: 1, name: "Anti-Mage", roles: ["CARRY"], damageType: "physical" }
    ];

    const enemyTeam = [];

    // Test available heroes
    const availableHeroes = teamAnalysisService.getAvailableHeroes(allHeroes, allyTeam, enemyTeam);
    expect(availableHeroes).toHaveLength(4); // All except Anti-Mage
    expect(availableHeroes.map(h => h.id)).not.toContain(1); // Should not include Anti-Mage

    // Test team needs
    const needs = teamAnalysisService.getTeamNeeds(allyTeam);
    expect(needs.needsInitiation).toBe(true);
    expect(needs.needsDisable).toBe(true);
    expect(needs.needsTankiness).toBe(true);

    // Test role balance scoring
    const axeScore = teamAnalysisService.calculateRoleBalanceScore(allHeroes[1], 
      teamAnalysisService.calculateTeamBalance(allyTeam));
    expect(axeScore).toBe(100); // Should get high score for filling needed roles

    const lionScore = teamAnalysisService.calculateRoleBalanceScore(allHeroes[3], 
      teamAnalysisService.calculateTeamBalance(allyTeam));
    expect(lionScore).toBe(100); // Should get high score for filling support/disable role
  });

  test('Scenario 5: Damage Type Balance', () => {
    const allyTeam = [
      { id: 1, name: "Anti-Mage", roles: ["CARRY"], damageType: "physical" },
      { id: 2, name: "Phantom Assassin", roles: ["CARRY"], damageType: "physical" }
    ];

    const balance = teamAnalysisService.calculateTeamBalance(allyTeam);
    expect(balance.physicalDamage).toBe(100);
    expect(balance.magicalDamage).toBe(0);

    // Test magical damage hero score
    const hero = { id: 3, name: "Lina", roles: ["NUKER"], damageType: "magical" };
    const score = teamAnalysisService.calculateDamageTypeScore(hero, balance);
    expect(score).toBe(100); // Should get high score for providing magical damage
  });
}); 