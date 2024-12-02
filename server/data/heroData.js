const heroes = [
  {
    id: 1,
    name: 'Anti-Mage',
    primaryAttribute: 'Agility',
    roles: ['Carry', 'Escape'],
    counters: [2, 5, 8],
    synergies: [3, 6, 9],
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
  {
    id: 3,
    name: 'Axe',
    primaryAttribute: 'Strength',
    roles: ['Initiator', 'Durable', 'Disabler'],
    counters: [1, 4],
    synergies: [2, 5],
    lanes: ['off']
  },
  {
    id: 4,
    name: 'Lina',
    primaryAttribute: 'Intelligence',
    roles: ['Support', 'Carry', 'Nuker'],
    counters: [1, 3],
    synergies: [2, 5],
    lanes: ['mid', 'support']
  },
  {
    id: 5,
    name: 'Earthshaker',
    primaryAttribute: 'Strength',
    roles: ['Support', 'Initiator', 'Disabler'],
    counters: [2, 4],
    synergies: [1, 3],
    lanes: ['support', 'roam']
  }
];

module.exports = heroes; 