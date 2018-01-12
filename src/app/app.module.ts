import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GdprassessmentComponent } from './gdprassessment/gdprassessment.component';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    GdprassessmentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
