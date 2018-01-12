import { GDPRAssessmentInfo } from './gdprAssessmentInfo.model';
import { RequestorInfoModel } from './requestorInfo.model';

export class GDPRQuickAssessmentBean {
  requestor: RequestorInfoModel;
  assessmentInfo: GDPRAssessmentInfo;
}
