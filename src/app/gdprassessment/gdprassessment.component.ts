import { APIGatewayService } from './apigatewayservice';
import { APIGatewayResponse } from './model/apigatewayresponse.model';
import { Component, Directive, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgControl, NgForm, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { ValidationErrors, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ResultDialogComponent } from './resultdialog/resultdialog.component';
import { GDPRAssessmentRequest } from './model/gdprassessmentrequest.model';
import { GDPRAssessmentInfo } from './model/gdprAssessmentInfo.model';
import { RequestorInfo } from './model/requestorInfo.model';
import { Certification } from './model/certification.model';
import { IAASProvider } from './model/iaasprovider.model';
import { Country } from './model/country.model';
import { GDPRAssessmentResponse } from './model/gdprassessmentresponse.model';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface ValidationErrors {
  control_name: string;
  error_name: string;
  error_value: any;
}

export interface FormGroupControls {
  [key: string]: AbstractControl;
}

export function getFormValidationErrors(controls: FormGroupControls): ValidationErrors[] {
  let errors: ValidationErrors[] = [];
  Object.keys(controls).forEach(key => {
    const control = controls[ key ];
    if (control instanceof FormGroup) {
      errors = errors.concat(getFormValidationErrors(control.controls));
    }
    const controlErrors: ValidationErrors = controls[ key ].errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          control_name: key,
          error_name: keyError,
          error_value: controlErrors[ keyError ]
        });
      });
    }
  });
  return errors;
}

@Component({
  selector: 'app-gdprassessment',
  templateUrl: './gdprassessment.component.html',
  styleUrls: ['./gdprassessment.component.css']
})

export class GdprassessmentComponent implements OnInit, ErrorStateMatcher {

  requestor: RequestorInfo;
  assessmentInfo: GDPRAssessmentInfo;
  gdprRequest: GDPRAssessmentRequest;
  apiGatewayResponse: APIGatewayResponse;

  public loading = false;
  COUNTRY_LIST = Country.getCountryList();
  CERTIFICATION_LIST = Certification.getCertificationList();
  IAAS_PROVIDER_LIST = IAASProvider.getIAASProviderList();

  // Valdations
  namePattern = /^[A-Z][A-z -,.]+$/;
  companyNamePattern = /^[A-Z0-9]A-z0-9- ,.]+$/;
  phonePattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  addressPattern = new RegExp('' +
    // Street Number
    /^(\d+[A-z]?)\s/.source +
    // Street Ordinal (N, S, E, W)
    /(([NESW][.]?)[\s])?/.source +
    // Street_Name Street_Type Unit_Type_Unit Designator,
    /(([0-9A-z-.\s]{3,80})\s([A-z0-9-.]+)?(\s(([A-z0-9.]+\s)?(#?[0-9A-z]+)))?)/.source +
    // City, State, Zip Code+4, Country
    /,\s([A-z-\s]+),\s([A-z]+)\s(([0-9]{5})(-[0-9]{4})?)?(\s([A-z-\s]+))?$/.source
  );
  integerPattern = /^[0-9]{1,8}$/;

  assessmentFG: FormGroup;
  requestorFG: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  title: FormControl;
  phone: FormControl;
  email: FormControl;
  companyName: FormControl;
  companyAddress: FormControl;

  assessmentInfoFG: FormGroup;
  officeCount: FormControl;
  employeeCount: FormControl;
  contractorCount: FormControl;
  productTypeCount: FormControl;
  customerCount: FormControl;
  iaasProviderCount: FormControl;
  hqLocation: FormControl;
  officeLocations: FormControl;
  employeeLocations: FormControl;
  contractorLocations: FormControl;
  countriesServiced: FormControl;
  iaasProviders: FormControl;
  iaasProviderLocations: FormControl;
  isPrivacyShieldCertified: FormControl;
  certifications: FormControl;
  dataClassificationLevels: FormControl;

  constructor(private http: HttpClient, public dialog: MatDialog, private apiGateway: APIGatewayService) {
    this.requestor = new RequestorInfo();
    this.assessmentInfo = new GDPRAssessmentInfo();
    this.gdprRequest = new GDPRAssessmentRequest(this.requestor, this.assessmentInfo);
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {

      this.firstName = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.lastName = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.title = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.phone = new FormControl('', [
        Validators.required,
        Validators.pattern(this.phonePattern)
      ]);
      this.email = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);
      this.companyName = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(this.namePattern)
      ]);
      this.companyAddress = new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
        Validators.pattern(this.addressPattern)
      ]);
      this.officeCount = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.employeeCount = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.contractorCount = new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.productTypeCount = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000),
        Validators.pattern(this.integerPattern)
      ]);
      this.customerCount = new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(10000000000),
        Validators.pattern(this.integerPattern)
      ]);
      this.iaasProviderCount = new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
        Validators.pattern(this.integerPattern)
      ]);
      this.hqLocation               = new FormControl('', [ Validators.required ]);
      this.officeLocations          = new FormControl('', [ Validators.required ]);
      this.employeeLocations        = new FormControl('', [ Validators.required ]);
      this.contractorLocations      = new FormControl('', [] );
      this.countriesServiced        = new FormControl('', [ Validators.required ]);
      this.iaasProviders            = new FormControl('', [] );
      this.iaasProviders.disable();
      this.iaasProviderLocations    = new FormControl('', [] );
      this.iaasProviderLocations.disable();
      this.isPrivacyShieldCertified = new FormControl('', [ Validators.required ]);
      this.certifications           = new FormControl('', [ Validators.required ]);
      this.dataClassificationLevels = new FormControl('', [ Validators.required ]);
  }


  onUpdateContractorCountValue() {
    if (this.assessmentInfo.contractorCount < 1) {
      this.contractorLocations.disable();
    } else {
      this.contractorLocations.enable();
    }
  }

  onUpdateProviderCountValue() {
    if (this.assessmentInfo.iaasProviderCount < 1) {
      this.iaasProviders.disable();
      this.iaasProviderLocations.disable();
    } else {
      this.iaasProviders.enable();
      this.iaasProviderLocations.enable();
    }
  }

  createForm() {
    this.requestorFG = new FormGroup({
        firstName: this.firstName,
        lastName: this.lastName,
        title: this.title,
        phone: this.phone,
        email: this.email,
        companyName: this.companyName,
        companyAddress: this.companyAddress
    });
    this.assessmentInfoFG =  new FormGroup({
        hqLocation: this.hqLocation,
        countriesServiced: this.countriesServiced,
        officeCount: this.officeCount,
        officeLocations: this.officeLocations,
        employeeCount: this.employeeCount,
        employeeLocations: this.employeeLocations,
        contractorCount: this.contractorCount,
        contractorLocations: this.contractorLocations,
        productTypeCount: this.productTypeCount,
        customerCount: this.customerCount,
        iaasProviderCount: this.iaasProviderCount,
        iaasProviders: this.iaasProviders,
        iaasProviderLocations: this.iaasProviderLocations,
        isPrivacyShieldCertified: this.isPrivacyShieldCertified,
        certifications: this.certifications,
        dataClassificationLevels: this.dataClassificationLevels
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

  getValidationErrors(): Array<string> {
    const errorTextArray: Array<string> = new Array<string>();
      if (!this.assessmentFG.valid) {
          const validationErrors: Array<ValidationErrors> = getFormValidationErrors(this.assessmentFG.controls);
          for (const validationError of validationErrors) {
            let text;
            switch (validationError.error_name) {
              case 'required': text = `${validationError.control_name} is required!`; break;
              case 'email': text = `${validationError.control_name} has an incorrect email format!`; break;
              case 'pattern': text = `${validationError.control_name} has wrong pattern!`; break;
              case 'minlength': text = `${validationError.control_name} is too short`; break;
              case 'maxlength': text = `${validationError.control_name} is too long`; break;
              default: text = `${validationError.control_name}: ${validationError.error_name}: ${validationError.error_value}`;
            }
            errorTextArray.push(text);
          }
      }
    return errorTextArray;
  }

  submitForm() {
    this.loading = true;
    this.gdprRequest.requestor = this.requestor;
    this.gdprRequest.assessmentInfo = this.assessmentInfo;
    this.apiGateway.create(this.gdprRequest)
      .subscribe(
        data => { // Success
            this.loading = false;
            this.apiGatewayResponse = data;
            if (this.apiGatewayResponse != null && this.apiGatewayResponse.statusCode == "200") {
                this.openDialog();
            } else {
              console.log('Error received from WebAssessment');
              // TODO: display error dialog.
              this.assessmentFG.markAsPristine();
              this.assessmentFG.disable();
            }
      },
       err => { // Failure
         console.log(err);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '400px',
      data: {
        companyName: this.requestor.companyName,
        score: this.apiGatewayResponse.body.score,
        name: this.requestor.firstName + ' ' + this.requestor.lastName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.assessmentFG.markAsPristine();
      this.assessmentFG.disable();
    });
  }
}
