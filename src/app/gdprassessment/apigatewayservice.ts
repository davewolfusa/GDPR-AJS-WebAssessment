import { APIGatewayResponse } from './model/apigatewayresponse.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GDPRAssessmentRequest } from './model/gdprassessmentrequest.model';
import { GDPRAssessmentResponse } from './model/gdprassessmentresponse.model';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

const GDPR_LAMBDA_URL = 'https://d503c4cwl9.execute-api.us-west-2.amazonaws.com/prod/GDPRAssessment';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class APIGatewayService {

  response: APIGatewayResponse;
  loading: boolean;

  constructor(private http: HttpClient) {
    this.loading = false;
    this.response = null;
  }

  create(requestData: GDPRAssessmentRequest): Observable<APIGatewayResponse> {
    // Make the HTTP request:
    // 'X-Amz-Invocation-Type' : 'RequestResponse',
    const body = JSON.stringify(requestData);

    return this.http.post <APIGatewayResponse> ( GDPR_LAMBDA_URL, body, httpOptions )
      .map(res => {
        return res;
      });
  }

  getResponse(): APIGatewayResponse {
    return this.response;
  }
}
