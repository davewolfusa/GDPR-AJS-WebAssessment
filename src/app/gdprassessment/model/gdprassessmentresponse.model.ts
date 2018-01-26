import { $ } from 'protractor';
export class GDPRAssessmentResponse {

  result: string;
  score: number;

  constructor(result: string, score: number) {
    this.result = result;
    this.score  = score;
  }
}
