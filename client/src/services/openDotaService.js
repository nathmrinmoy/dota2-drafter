const OPENDOTA_BASE_URL = 'https://api.opendota.com/api';

class OpenDotaService {
  async fetchProMatches(limit = 100) {
    const response = await fetch(`${OPENDOTA_BASE_URL}/proMatches?limit=${limit}`);
    return await response.json();
  }

  async fetchMatchDetails(matchId) {
    const response = await fetch(`${OPENDOTA_BASE_URL}/matches/${matchId}`);
    return await response.json();
  }

  async fetchHeroStats() {
    const response = await fetch(`${OPENDOTA_BASE_URL}/heroStats`);
    return await response.json();
  }
}

export const openDotaService = new OpenDotaService(); 