export class Country {

    public id: string;
    public name: string;
    public continent: string;
    public isEUMember: boolean;

    constructor() {
    }
  
    getId() { return this.id; }
    getName() { return this.name; }
    getContinent() { return this.continent; }
    getisEUMember() { return this.isEUMember; }
}
