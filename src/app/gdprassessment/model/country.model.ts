export class Country {

    id: string;
    name: string;
    continent: string;
    isEUMember: boolean;

    public static getCountryList(): Array<Country> {
      const result: Array<Country> = [
      { id: 'UNITED_STATES', name: 'United States', continent: 'AMERICAS', isEUMember: false },
      { id: 'CANADA', name: 'Canada', continent: 'AMERICAS', isEUMember: false },
      { id: 'MEXICO', name: 'Mexico', continent: 'AMERICAS', isEUMember: false },
      { id: 'UNITED_KINGDOM', name: 'United Kingdom', continent: 'EUROPE', isEUMember: true },
      { id: 'FRANCE', name: 'France', continent: 'EUROPE', isEUMember: true },
      { id: 'GERMANY', name: 'Germany', continent: 'EUROPE', isEUMember: true },
      { id: 'SPAIN', name: 'Spain', continent: 'EUROPE', isEUMember: true },
      { id: 'RUSSIA', name: 'Russia', continent: 'EUROPE', isEUMember: false },
      { id: 'CHINA', name: 'China', continent: 'ASIA', isEUMember: false },
      { id: 'JAPAN', name: 'Japan', continent: 'ASIA', isEUMember: false }
      ];

      return result;
  }
}
