import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RequestorInfoModel } from './model/requestorInfo.model';
import { GDPRAssessmentInfo } from './model/gdprAssessmentInfo.model';
import { Certification } from './model/certification.model';
import { Country } from './model/country.model';
import { GDPRQuickAssessmentBean } from './model/gdprquickassessmentbean.model';
import { IAASProvider } from './model/iaasprovider.model';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// return iaasProviderCountFC.dirty && iaasProviderCountFC === 0;

@Component({
  selector: 'app-gdprassessment',
  templateUrl: './gdprassessment.component.html',
  styleUrls: ['./gdprassessment.component.css']
})

export class GdprassessmentComponent implements OnInit, ErrorStateMatcher {

  GDPR_LAMBDA_URL = 'https://d503c4cwl9.execute-api.us-west-2.amazonaws.com/prod/GDPRAssessment';
  requestor: RequestorInfoModel;
  assessmentInfo: GDPRAssessmentInfo;
  gdprBean: GDPRQuickAssessmentBean;
  results: string[];

  isFormValid = false;
  areProviderFieldsDisabled = true;


  // Valdations
  namePattern = /^[a-zA-Z][a-zA-Z ,]+$/;
  phonePattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  addressPattern = /^[0-9]{1,8}[ ][a-zA-Z][a-zA-Z0-9 ,\.\#]+$/;
  integerPattern = /^[0-9]{1,8}$/;

  assessmentFG: FormGroup;
  requestorFG: FormGroup;
  firstNameFC: FormControl;
  lastNameFC: FormControl;
  titleFC: FormControl;
  phoneFC: FormControl;
  emailFC: FormControl;
  companyNameFC: FormControl;
  companyAddressFC: FormControl;

  assessmentInfoFG: FormGroup;
  officeCountFC: FormControl;
  employeeCountFC: FormControl;
  contractorCountFC: FormControl;
  productTypeCountFC: FormControl;
  customerCountFC: FormControl;
  iaasProviderCountFC: FormControl;
  hqLocationFC: FormControl;
  officeLocationsFC: FormControl;
  employeeLocationsFC: FormControl;
  contractorLocationsFC: FormControl;
  countriesServicedFC: FormControl;
  iaasProvidersFC: FormControl;
  iaasProviderLocationsFC: FormControl;
  isPrivacyShieldCertifiedFC: FormControl;
  certificationsFC: FormControl;
  dataClassificationLevelsFC: FormControl;

  public CERTIFICATION_LIST: Array<Certification> = [
      { id: 'NONE', name: 'None' },
      { id: 'ISO', name: 'ISO' },
      { id: 'PCI', name: 'PCI' },
      { id: 'HIPPA', name: 'HIPPA' },
      { id: 'US_FEDRAL', name: 'US Federal' }
  ];

  public IAAS_PROVIDER_LIST: Array<IAASProvider> = [
      { id: 'AMAZON_WEB_SERVICES', name: 'Amazon Web Services' },
      { id: 'GOOGLE_CLOUD_PLATFORM', name: 'Google Cloud Platform' },
      { id: 'MICROSOFT_AZURE', name: 'Microsoft Azure' },
      { id: 'OTHER', name: 'Other' }
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
    this.gdprBean = new GDPRQuickAssessmentBean();
    this.requestor = new RequestorInfoModel();
    this.assessmentInfo = new GDPRAssessmentInfo();
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {

      this.firstNameFC = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.lastNameFC = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.titleFC = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.phoneFC = new FormControl('', [
        Validators.required,
        Validators.pattern(this.phonePattern)
      ]);
      this.emailFC = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);
      this.companyNameFC = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.companyAddressFC = new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
        Validators.pattern(this.addressPattern)
      ]);
      this.officeCountFC = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.employeeCountFC = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.contractorCountFC = new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.productTypeCountFC = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000),
        Validators.pattern(this.integerPattern)
      ]);
      this.customerCountFC = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10000000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.iaasProviderCountFC = new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
        Validators.pattern(this.integerPattern)
      ]);
      this.hqLocationFC = new FormControl('', [ Validators.required ]);
      this.officeLocationsFC = new FormControl('', [ Validators.required ]);
      this.employeeLocationsFC = new FormControl('', [ Validators.required ]);
      this.contractorLocationsFC = new FormControl('', [ ]);
      this.countriesServicedFC = new FormControl('', [ Validators.required ]);
      this.iaasProvidersFC = new FormControl({ value: '', disabled: true});
      this.iaasProviderLocationsFC = new FormControl({ value: '', disabled: true});
      this.isPrivacyShieldCertifiedFC = new FormControl('', [ Validators.required ]);
      this.certificationsFC = new FormControl('', [ Validators.required ]);
      this.dataClassificationLevelsFC = new FormControl('', [ Validators.required ]);
  }

  onUpdateContractorCountValue() {
    if (this.assessmentInfo.contractorCount < 1) {
      this.contractorLocationsFC.disable();
    } else {
      this.contractorLocationsFC.enable();
    }
  }

  onUpdateProviderCountValue() {
    if (this.assessmentInfo.iaasProviderCount < 1) {
      this.iaasProvidersFC.disable();
      this.iaasProviderLocationsFC.disable();
    } else {
      this.iaasProvidersFC.enable();
      this.iaasProviderLocationsFC.enable();
    }
  }

  createForm() {
    this.requestorFG = new FormGroup({
        firstNameFC: this.firstNameFC,
        lastNameFC: this.lastNameFC,
        titleFC: this.titleFC,
        phoneFC: this.phoneFC,
        emailFC: this.emailFC,
        companyName: this.companyNameFC,
        companyAddressFC: this.companyAddressFC
    });
    this.assessmentInfoFG =  new FormGroup({
        hqLocationFC: this.hqLocationFC,
        countriesServicedFC: this.countriesServicedFC,
        officeCountFC: this.officeCountFC,
        officeLocationsFC: this.officeLocationsFC,
        employeeCountFC: this.employeeCountFC,
        employeeLocationsFC: this.employeeLocationsFC,
        contractorCountFC: this.contractorCountFC,
        contractorLocationsFC: this.contractorLocationsFC,
        productTypeCountFC: this.productTypeCountFC,
        customerCountFC: this.customerCountFC,
        iaasProviderCountFC: this.iaasProviderCountFC,
        iaasProvidersFC: this.iaasProvidersFC,
        iaasProviderLocationsFC: this.iaasProviderLocationsFC,
        isPrivacyShieldCertifiedFC: this.isPrivacyShieldCertifiedFC,
        certificationsFC: this.certificationsFC,
        dataClassificationLevelsFC: this.dataClassificationLevelsFC
    });
    this.assessmentFG = new FormGroup({
        requestorFG: this.requestorFG,
        assessmentInfoFG: this.assessmentInfoFG
    });
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

    // Make the HTTP request:
    // 'X-Amz-Invocation-Type' : 'RequestResponse',
    this.http.post
    (
      this.GDPR_LAMBDA_URL,
      this.gdprBean.toString(),
      {
        headers: {
          'Content-Type' : 'application/json'
        }
      }
    ).subscribe(data => {
      // Read the result field from the JSON response.
      this.results = data['results'];
    });
  }
}
