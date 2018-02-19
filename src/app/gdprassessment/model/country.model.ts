export class Country {

    public id: string;
    public name: string;
    public continent: string;
    public isEUMember: boolean;

    constructor(id: string, name: string, continent: string, isEUMember: boolean) {
      this.id = id;
      this.name = name;
      this.continent = continent;
      this.isEUMember = isEUMember;
    }
  
    getId() { return this.id; }
    getName() { return this.name; }
    getContinent() { return this.continent; }
    getisEUMember() { return this.isEUMember; }
}
