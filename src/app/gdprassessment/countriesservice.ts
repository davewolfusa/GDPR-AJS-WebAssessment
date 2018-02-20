import { Country } from './model/country.model';
import { CountriesResponse } from './countriesresponse';
import { CountriesSource } from './countriessource';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/Rx';

const COUNTRIES_JSON_FILE_PATH = '../../../assets/countries.json';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const SOURCE_HTML_1 = "<div style='padding: 1px;'>";
const SOURCE_HTML_2 = "</div>";

@Injectable()
export class CountriesService {
  
    response: CountriesResponse;
  
    constructor(public http:HttpClient) {
      this.response = null;
    }

  loadCountriesData(): Observable<CountriesResponse> {
    return this.http.get <CountriesResponse>(COUNTRIES_JSON_FILE_PATH, httpOptions)
        .map(res => res);
  }
  
  public getResponse() {
    return this.response;
  }
  
  public getCountriesSourceArray(): Array<CountriesSource> {
    var sourceArray: Array<CountriesSource> = new Array<CountriesSource>();
    var countryArray: Array<Country> = this.response.countries;
    for (let country of countryArray) {
      var htmlString = SOURCE_HTML_1 + country.getName() + SOURCE_HTML_2;
      var groupString = country.isEUMember ? ('EU-' + country.continent) : country.continent;
      let source: CountriesSource = new CountriesSource(htmlString, country.getId(), groupString);
      sourceArray.push(source);
    }
    return sourceArray;
  }
  
  /* CountriesSource Example
{ html: "<div style='padding: 1px;'><div>United States</div></div>", value: "UNITED_STATES", group: "AMERICAS" },  
{ html: "<div style='padding: 1px;'><div>Spain</div></div>", value: "SPAIN", group: "EU-Europe" },  
{ html: "<div style='padding: 1px;'><div>United Kingdom</div></div>", value: "UNITED_KINGDOM", group: "Europe" }  
   */
}
