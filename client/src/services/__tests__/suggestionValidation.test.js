import { validationService } from '../validationService';

describe('Suggestion System Validation', () => {
  beforeAll(async () => {
    await validationService.initialize();
    console.log('Hero stats loaded:', validationService.heroStats?.length);
  });

  test('Pro Match Validation', async () => {
    const validation = await validationService.validateSuggestions(100);
    
    console.log('\n=== Validation Results ===');
    console.log(`Total Matches Analyzed: ${validation.totalMatches}`);
    console.log(`Overall Accuracy: ${validation.accuracy.toFixed(2)}%`);
    console.log(`Role Accuracy: ${validation.roleAccuracy.toFixed(2)}%`);
    console.log(`Synergy Accuracy: ${validation.synergyAccuracy.toFixed(2)}%`);
    console.log(`Counter Accuracy: ${validation.counterAccuracy.toFixed(2)}%`);
  });

  test('Specific Draft Scenarios', async () => {
    const scenarios = [
      {
        description: 'TI10 Final Game 1 - Team Spirit vs PSG.LGD',
        allyTeam: [5, 103, 97], // Tiny, Elder Titan, Magnus
        enemyTeam: [114, 26, 23], // Monkey King, Lion, Kunkka
        actualPick: 48, // Luna
        expectedSuggestions: [48, 15, 70] // Luna, Razor, TB
      },
      {
        description: 'TI11 Final Game 3 - Tundra vs Secret',
        allyTeam: [2, 25, 89], // Axe, Lina, Naga
        enemyTeam: [74, 43, 51], // Invoker, DP, Slark
        actualPick: 47, // Viper
        expectedSuggestions: [47, 106, 68] // Viper, Enchantress, Huskar
      },
      {
        description: 'Lima Major 2023 Final - Gaimin vs Liquid',
        allyTeam: [59, 28, 77], // Huskar, Snapfire, Morphling
        enemyTeam: [97, 26, 69], // Magnus, Lion, Doom
        actualPick: 86, // Rubick
        expectedSuggestions: [86, 33, 45] // Rubick, Enigma, Pugna
      }
    ];

    for (const scenario of scenarios) {
      console.log(`\n=== Testing ${scenario.description} ===`);
      const suggestions = await validationService.getSuggestedHeroes(
        scenario.allyTeam,
        scenario.enemyTeam
      );

      console.log('Expected picks:', scenario.expectedSuggestions);
      console.log('Our suggestions:', suggestions.slice(0, 3));
      
      // Test the match
      expect(suggestions.slice(0, 3)).toEqual(
        expect.arrayContaining(scenario.expectedSuggestions)
      );
    }
  });
}); 