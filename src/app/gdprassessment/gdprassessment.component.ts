import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RequestorInfoModel } from './model/requestorInfo.model';
import { GDPRAssessmentInfo } from './model/gdprAssessmentInfo.model';
import { Certification } from './model/certification.model';
import { Country } from './model/country.model';
import { IAASProvider } from './model/iaasprovider.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-gdprassessment',
  templateUrl: './gdprassessment.component.html',
  styleUrls: ['./gdprassessment.component.css']
})
export class GdprassessmentComponent implements OnInit, ErrorStateMatcher {

  requestor: RequestorInfoModel;
  assessmentInfo: GDPRAssessmentInfo;

  selectedOfficeLocations = new FormControl();
  selectedEmployeeLocations = new FormControl();
  selectedContractorLocations = new FormControl();
  selectedCountriesServiced = new FormControl();
  selectedIAASProviderLocations = new FormControl();
  selectedCertifications = new FormControl();
  selectedIAASProviders = new FormControl();

  // Valdations
  namePattern = /^[a-zA-Z][a-zA-Z ,]+$/;
  firstNameFC = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
    Validators.pattern(this.namePattern)
  ]);
  lastNameFC = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
    Validators.pattern(this.namePattern)
  ]);
  titleFC = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
    Validators.pattern(this.namePattern)
  ]);
  phonePattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  phoneFC = new FormControl('', [
    Validators.required,
    Validators.pattern(this.phonePattern)
  ]);
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  companyNameFC = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(60),
    Validators.pattern(this.namePattern)
  ]);
  addressPattern = /^[0-9]{1,8}[ ][a-zA-Z][a-zA-Z0-9 ,\.\#]+$/;
  companyAddressFC = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100),
    Validators.pattern(this.addressPattern)
  ]);
  integerPattern = /^[0-9]{1,8}$/;
  officeCountFC = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.pattern(this.integerPattern)
  ]);
  employeeCountFC = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.pattern(this.integerPattern)
  ]);
  contractorCountFC = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.pattern(this.integerPattern)
  ]);
  productTypeCountFC = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.pattern(this.integerPattern)
  ]);
  customerCountFC = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.pattern(this.integerPattern)
  ]);
  iaasProviderCountFC = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.pattern(this.integerPattern)
  ]);

  public CERTIFICATION_LIST: Array<Certification> = [
      { id: 'ISO', name: 'ISO' },
      { id: 'PCI', name: 'PCI' },
      { id: 'HIPPA', name: 'HIPPA' },
      { id: 'US_FEDRAL', name: 'US Federal' }
  ];

  public IAAS_PROVIDER_LIST: Array<IAASProvider> = [
      { id: 'AMAZON_WEB_SERVICES', name: 'Amazon Web Services' },
      { id: 'GOOGLE_CLOUD_PLATFORM', name: 'Google Cloud Platform' },
      { id: 'MICROSOFT_AZURE', name: 'Microsoft Azure' }
  ];

  public COUNTRY_LIST: Array<Country> = [
      { id: 'UNITED_STATES', name: 'United States', continent: 'AMERICAS', isEUMember: false },
      { id: 'CANADA', name: 'Canada', continent: 'AMERICAS', isEUMember: false },
      { id: 'MEXICO', name: 'Mexico', continent: 'AMERICAS', isEUMember: false },
      { id: 'UNITED_KINGDOM', name: 'United Kingdom', continent: 'EUROPE', isEUMember: true },
      { id: 'FRANCE', name: 'France', continent: 'EUROPE', isEUMember: true },
      { id: 'GERMANY', name: 'Germany', continent: 'EUROPE', isEUMember: true },
      { id: 'SPAIN', name: 'Spain', continent: 'EUROPE', isEUMember: true },
      { id: 'RUSSIA', name: 'Russia', continent: 'EUROPE', isEUMember: false },
      { id: 'CHINA', name: 'China', continent: 'ASIA', isEUMember: false }
  ];

  constructor() {
    this.requestor = new RequestorInfoModel();
    this.assessmentInfo = new GDPRAssessmentInfo();
  }

  ngOnInit() {
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  getTextErrorMessages(formControl: FormControl, fieldNameString: string, maxLength: number) {
    let message = '';
    if (formControl.invalid) {
      if (formControl.errors.required) {
        message = 'You must enter a value';
      } else {
        if (formControl.errors.minLength || formControl.errors.maxLength) {
          message = 'A ' + fieldNameString + ' must be between 2 and ' + maxLength +
            ' characters in length.';
        } else {
          message = 'Please enter a valid ' + fieldNameString + '.';
        }
      }
    }
    return message;
  }

  getFieldErrorMessages(formControl: FormControl, fieldNameString: string) {
    let message = '';
    if (formControl.invalid) {
      if (formControl.errors.required) {
        message = 'You must enter a value';
      } else {
          message = 'Please enter a valid ' + fieldNameString + '.';
      }
    }
    return message;
  }

  getLevelFieldErrorMessages(formControl: FormControl, fieldNameString: string) {
    let message = '';
    if (formControl.invalid) {
      if (formControl.errors.required) {
        message = 'You must enter a value';
      } else {
          message = 'Please enter a valid ' + fieldNameString + ' the value must be an integer (1 - 10).';
      }
    }
    return message;
  }

}
