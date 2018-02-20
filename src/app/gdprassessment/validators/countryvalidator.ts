import { Country } from '../model/country.model';
import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

export function countryValidator(countryArray: Array<Country>): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    var invalidValue = true;
    for (let country of countryArray) {
      if (control.value == country.id) {
        invalidValue = false;
        break;
      }
    }
    return invalidValue ? { 'InvalidValue' : {value: control.value}} : null;
  };
}
