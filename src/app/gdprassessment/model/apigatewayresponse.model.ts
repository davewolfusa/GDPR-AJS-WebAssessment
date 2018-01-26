import { GDPRAssessmentResponse } from './gdprassessmentresponse.model';

// {"statusCode":"200","body":{"result":"Success","score":42.21},"base64Encoded":false}
export class APIGatewayResponse {
  base64Encoded = false;
  statusCode: string;
  headers: Object[];
  body: GDPRAssessmentResponse;
}
