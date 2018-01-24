import { GDPRAssessmentInfo } from './gdprAssessmentInfo.model';
import { RequestorInfo } from './requestorInfo.model';

export class GDPRQuickAssessmentBean {
  requestor: RequestorInfo;
  assessmentInfo: GDPRAssessmentInfo;
  
  constructor(requestor: RequestorInfo, assessmentInfo: GDPRAssessmentInfo) {
    this.requestor = requestor;
    this.assessmentInfo = assessmentInfo;
  }
}
