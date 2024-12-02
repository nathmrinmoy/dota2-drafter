import localHeroesData from '../data/heroesData.json';

const API_URL = 'https://api.opendota.com/api';
let cachedHeroes = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const INITIAL_DELAY = 5000;

class HeroService {
  async getAllHeroes() {
    try {
      // Check cache first
      const now = Date.now();
      if (cachedHeroes && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedHeroes;
      }

      // Try fetching with retries
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          // Add exponential backoff delay
          if (attempt > 0) {
            const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
          }

          const [heroResponse, abilitiesResponse] = await Promise.all([
            fetch(`${API_URL}/heroStats`),
            fetch(`${API_URL}/constants/abilities`)
          ]);

          if (!heroResponse.ok || !abilitiesResponse.ok) {
            throw new Error(`Failed to fetch data: ${heroResponse.status}`);
          }

          const [heroData, abilitiesData] = await Promise.all([
            heroResponse.json(),
            abilitiesResponse.json()
          ]);

          // Map heroes with their abilities
          const mappedHeroes = heroData.map(hero => {
            const shortName = hero.name.replace('npc_dota_hero_', '');
            
            // Get hero's abilities
            const heroAbilities = Object.entries(abilitiesData)
              .filter(([key, ability]) => {
                const isHeroAbility = key.toLowerCase().includes(shortName.toLowerCase());
                const isNotSpecial = !key.includes('special_');
                const isNotGeneric = !key.includes('generic_');
                const isNotBonus = !key.includes('bonus_');
                const isNotHidden = !key.includes('hidden_');
                const hasName = ability.dname;

                return isHeroAbility && isNotSpecial && isNotGeneric && isNotBonus && isNotHidden && hasName;
              })
              .map(([key, ability]) => {
                // Clean up the ability key for URLs
                const abilityKey = key
                  .replace('npc_dota_', '')
                  .replace('ability_', '')
                  .replace(`hero_${shortName}_`, '');

                return {
                  name: ability.dname,
                  // Multiple CDN sources as fallbacks
                  icon: [
                    `https://cdn.stratz.com/images/dota2/abilities/${key}.png`,
                    `https://cdn.dota2.com/apps/dota2/images/abilities/${abilityKey}_lg.png`,
                    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${shortName}_${abilityKey}.png`
                  ],
                  type: this.getAbilityType(ability),
                  description: ability.desc,
                  behavior: ability.behavior
                };
              });

            return {
              id: hero.id,
              name: hero.localized_name,
              shortName,
              primaryAttribute: this.mapAttribute(hero.primary_attr),
              roles: hero.roles || [],
              stats: {
                strength: `${hero.base_str} + ${hero.str_gain}`,
                agility: `${hero.base_agi} + ${hero.agi_gain}`,
                intelligence: `${hero.base_int} + ${hero.int_gain}`,
                health: 200 + (hero.base_str * 20),
                mana: 75 + (hero.base_int * 12),
              },
              abilities: heroAbilities,
              talents: {
                level10: ['+10 Talent Left', '+10 Talent Right'],
                level15: ['+15 Talent Left', '+15 Talent Right'],
                level20: ['+20 Talent Left', '+20 Talent Right'],
                level25: ['+25 Talent Left', '+25 Talent Right']
              },
              pros: this.getHeroPros(hero),
              cons: this.getHeroCons(hero),
              iconUrl: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`,
              fullImageUrl: `https://cdn.dota2.com/apps/dota2/images/heroes/${shortName}_full.png`,
              gridImage: `https://cdn.dota2.com/apps/dota2/images/heroes/${shortName}_lg.png`,
              aghanims: {
                scepter: null,
                shard: null
              }
            };
          });

          // Update cache and return
          cachedHeroes = mappedHeroes;
          lastFetchTime = Date.now();
          return mappedHeroes;

        } catch (retryError) {
          if (attempt === MAX_RETRIES - 1) {
            throw retryError; // Throw on last attempt
          }
          console.log(`Attempt ${attempt + 1} failed, retrying...`);
        }
      }

      // If we have cached data and all retries failed, return cache
      if (cachedHeroes) {
        console.log('All retries failed, using cached data');
        return cachedHeroes;
      }

      throw new Error('Failed to fetch heroes after all retries');

    } catch (error) {
      console.error('Error in getAllHeroes:', error);
      if (cachedHeroes) {
        return cachedHeroes;
      }
      throw error;
    }
  }

  mapHeroData(heroData, abilitiesData) {
    return heroData.map(hero => {
      const shortName = hero.name.replace('npc_dota_hero_', '');
      
      // Get hero's abilities if we have ability data
      const heroAbilities = Object.keys(abilitiesData).length > 0 
        ? this.getHeroAbilities(shortName, abilitiesData)
        : [];

      return {
        id: hero.id,
        name: hero.localized_name,
        shortName,
        primaryAttribute: this.mapAttribute(hero.primary_attr),
        roles: hero.roles || [],
        stats: {
          strength: `${hero.base_str} + ${hero.str_gain}`,
          agility: `${hero.base_agi} + ${hero.agi_gain}`,
          intelligence: `${hero.base_int} + ${hero.int_gain}`,
          health: 200 + (hero.base_str * 20),
          mana: 75 + (hero.base_int * 12),
        },
        abilities: heroAbilities, // Add back the abilities
        talents: {
          level10: [
            hero.talents?.talent1 || '+10 Talent Left',
            hero.talents?.talent2 || '+10 Talent Right'
          ],
          level15: [
            hero.talents?.talent3 || '+15 Talent Left',
            hero.talents?.talent4 || '+15 Talent Right'
          ],
          level20: [
            hero.talents?.talent5 || '+20 Talent Left',
            hero.talents?.talent6 || '+20 Talent Right'
          ],
          level25: [
            hero.talents?.talent7 || '+25 Talent Left',
            hero.talents?.talent8 || '+25 Talent Right'
          ]
        },
        pros: this.getHeroPros(hero),
        cons: this.getHeroCons(hero),
        iconUrl: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`,
        fullImageUrl: `https://cdn.dota2.com/apps/dota2/images/heroes/${shortName}_full.png`,
        gridImage: `https://cdn.dota2.com/apps/dota2/images/heroes/${shortName}_lg.png`,
        aghanims: {
          scepter: hero.aghanims_scepter_desc || null,
          shard: hero.aghanims_shard_desc || null
        }
      };
    });
  }

  getHeroAbilities(shortName, abilitiesData) {
    return Object.entries(abilitiesData)
      .filter(([key, ability]) => {
        const isHeroAbility = key.includes(shortName);
        const isNotSpecial = !key.includes('special_');
        const isNotGeneric = !key.includes('generic_');
        const isNotBonus = !key.includes('bonus_');
        const isNotHidden = !key.includes('hidden_');
        const isNotEmpty = ability.dname;

        return isHeroAbility && isNotSpecial && isNotGeneric && isNotBonus && isNotHidden && isNotEmpty;
      })
      .map(([key, ability]) => ({
        name: ability.dname,
        icon: `https://cdn.stratz.com/images/dota2/abilities/${key}.png`,
        type: this.getAbilityType(ability),
        description: ability.desc,
        behavior: ability.behavior
      }))
      .filter(ability => ability.name)
      .slice(0, 4);
  }

  getAbilityType(ability) {
    if (ability.behavior?.includes('DOTA_ABILITY_BEHAVIOR_PASSIVE')) {
      return 'Passive';
    }
    if (ability.behavior?.includes('DOTA_ABILITY_BEHAVIOR_TOGGLE')) {
      return 'Toggle';
    }
    if (ability.behavior?.includes('DOTA_ABILITY_BEHAVIOR_CHANNELLED')) {
      return 'Channel';
    }
    if (ability.behavior?.includes('DOTA_ABILITY_BEHAVIOR_UNIT_TARGET')) {
      return 'Target';
    }
    return 'Active';
  }

  mapAttribute(attr) {
    const attributeMap = {
      'str': 'STRENGTH',
      'agi': 'AGILITY',
      'int': 'INTELLIGENCE',
      'all': 'UNIVERSAL'
    };
    return attributeMap[attr] || 'UNIVERSAL';
  }

  getHeroesByAttribute(heroes, attribute) {
    if (!heroes || !Array.isArray(heroes)) return [];
    return heroes.filter(hero => hero.primaryAttribute === attribute);
  }

  getHeroPros(hero) {
    const pros = [];
    
    // Based on primary attribute
    switch (hero.primary_attr) {
      case 'str':
        pros.push('High survivability');
        break;
      case 'agi':
        pros.push('Strong right-click damage');
        break;
      case 'int':
        pros.push('Powerful spells');
        break;
    }

    // Based on roles
    if (hero.roles) {
      if (hero.roles.includes('Carry')) {
        pros.push('Scales well into late game');
      }
      if (hero.roles.includes('Support')) {
        pros.push('Strong early game impact');
      }
      if (hero.roles.includes('Initiator')) {
        pros.push('Good at starting fights');
      }
      if (hero.roles.includes('Durable')) {
        pros.push('Hard to kill');
      }
      if (hero.roles.includes('Nuker')) {
        pros.push('High burst damage');
      }
      if (hero.roles.includes('Pusher')) {
        pros.push('Good at taking objectives');
      }
      if (hero.roles.includes('Escape')) {
        pros.push('Hard to catch');
      }
    }

    return pros.slice(0, 3); // Return top 3 pros
  }

  getHeroCons(hero) {
    const cons = [];
    
    // Based on primary attribute
    switch (hero.primary_attr) {
      case 'str':
        cons.push('Low attack speed');
        break;
      case 'agi':
        cons.push('Squishy in early game');
        break;
      case 'int':
        cons.push('Mana dependent');
        break;
    }

    // Based on roles
    if (hero.roles) {
      if (hero.roles.includes('Carry')) {
        cons.push('Weak early game');
      }
      if (hero.roles.includes('Support')) {
        cons.push('Low scaling potential');
      }
      if (hero.roles.includes('Initiator')) {
        cons.push('Needs proper positioning');
      }
      if (hero.roles.includes('Nuker')) {
        cons.push('Cooldown dependent');
      }
      if (!hero.roles.includes('Escape')) {
        cons.push('No escape mechanism');
      }
      if (!hero.roles.includes('Durable')) {
        cons.push('Dies quickly if caught');
      }
    }

    return cons.slice(0, 3); // Return top 3 cons
  }
}

export default new HeroService(); 