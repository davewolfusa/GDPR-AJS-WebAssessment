import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RequestorInfoModel } from './model/requestorInfo.model';
import { GDPRAssessmentInfo } from './model/gdprAssessmentInfo.model';
import { Certification } from './model/certification.model';
import { Country } from './model/country.model';
import { GDPRQuickAssessmentBean } from './model/gdprquickassessmentbean.model';
import { IAASProvider } from './model/iaasprovider.model';
import { HttpClient } from '@angular/common/http';

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

  GDPR_LAMBDA_URL = 'https://zo1y52azmf.execute-api.us-west-2.amazonaws.com/prod/GDPRWebAssessFunction';
  requestor: RequestorInfoModel;
  assessmentInfo: GDPRAssessmentInfo;
  gdprBean: GDPRQuickAssessmentBean;
  results: string[];

  isFormValid = false;

  hqLocationFC = new FormControl('', [ Validators.required ]);
  officeLocationsFC = new FormControl('', [ Validators.required ]);
  employeeLocationsFC = new FormControl('', [ Validators.required ]);
  contractorLocationsFC = new FormControl('', [ Validators.required ]);
  countriesServicedFC = new FormControl('', [ Validators.required ]);
  iaasProvidersFC = new FormControl('', [ Validators.required ]);
  iaasProviderLocationsFC = new FormControl('', [ Validators.required ]);
  isPrivacyShieldCertifiedFC = new FormControl('', [ Validators.required ]);
  certificationsFC = new FormControl('', [ Validators.required ]);
  dataClassificationLevelsFC = new FormControl('', [ Validators.required ]);

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

  constructor(private http: HttpClient) {
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

  getSelectErrorMessages(formControl: FormControl, fieldNameString: string) {
    let message = '';
    if (formControl.invalid) {
      if (formControl.errors.required) {
        message = 'You must select a value';
      }
    }
    return message;
  }

  submitForm() {
    this.gdprBean = new GDPRQuickAssessmentBean();
    this.gdprBean.requestor = this.requestor;
    this.gdprBean.assessmentInfo = this.assessmentInfo;

    // Make the HTTP request:
    this.http.post(this.GDPR_LAMBDA_URL, this.gdprBean).subscribe(data => {
      // Read the result field from the JSON response.
      this.results = data['results'];
    });
  }

  onChangeEvent() {
    this.isFormValid = this.checkIsFormValid();
  }

  checkIsFormValid() {
    let result = true;
    if (this.firstNameFC.invalid) { result = false; }
    if (this.lastNameFC.invalid) { result = false; }
    if (this.titleFC.invalid) { result = false; }
    if (this.phoneFC.invalid) { result = false; }
    if (this.emailFC.invalid) { result = false; }
    if (this.companyNameFC.invalid) { result = false; }
    if (this.companyAddressFC.invalid) { result = false; }
    if (this.hqLocationFC.invalid) { result = false; }
    if (this.countriesServicedFC.invalid) { result = false; }
    if (this.officeCountFC.invalid) { result = false; }
    if (this.officeLocationsFC.invalid) { result = false; }
    if (this.employeeLocationsFC.invalid) { result = false; }
    if (this.contractorLocationsFC.invalid) { result = false; }
    if (this.iaasProvidersFC.invalid) { result = false; }
    if (this.iaasProviderLocationsFC.invalid) { result = false; }
    if (this.isPrivacyShieldCertifiedFC.invalid) { result = false; }
    if (this.certificationsFC.invalid) { result = false; }
    if (this.dataClassificationLevelsFC.invalid) { result = false; }
    return result;
  }

}
