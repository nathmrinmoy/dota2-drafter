import axios from 'axios';

const API_URL = 'https://api.opendota.com/api';
const IMAGE_CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes';

class HeroService {
  async getAllHeroes() {
    try {
      const response = await axios.get(`${API_URL}/heroStats`);
      
      const mappedHeroes = response.data.map(hero => {
        const cleanName = hero.name.replace('npc_dota_hero_', '');
        
        console.log('Mapping hero:', hero.name, 'Primary attr:', hero.primary_attr);
        
        const mappedHero = {
          id: hero.id,
          name: cleanName,
          localized_name: hero.localized_name,
          primary_attr: hero.primary_attr,
          roles: hero.roles || [],
          iconUrl: `${IMAGE_CDN}/${cleanName}.png`,
          gridImage: `${IMAGE_CDN}/${cleanName}.png`,
          fullImageUrl: `${IMAGE_CDN}/${cleanName}_full.jpg`,
          stats: {
            strength: hero.base_str,
            agility: hero.base_agi,
            intelligence: hero.base_int
          }
        };
        return mappedHero;
      });

      return mappedHeroes;

    } catch (error) {
      console.error('Error fetching heroes:', error);
      return [];
    }
  }
}

export default new HeroService(); 