import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { APIGatewayService } from './gdprassessment/apigatewayservice';
import { CountriesService } from './gdprassessment/countriesservice';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { GdprassessmentComponent} from './gdprassessment/gdprassessment.component';
import { HttpClientXsrfModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultDialogComponent } from './gdprassessment/resultdialog/resultdialog.component';
import { jqxGaugeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgauge';


@NgModule({
  declarations: [
    AppComponent,
    GdprassessmentComponent,
    jqxGaugeComponent,
    ResultDialogComponent
  ],
  entryComponents: [
    ResultDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'ACSM-GDPR_Assessment-Xsrf-Cookie',
      headerName: 'ACSM-GDPR_Assessment-Xsrf-Header',
    })
  ],
  providers: [
    APIGatewayService,
    CountriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
