
  export class RequestorInfo {
      firstName: string;
      lastName: string;
      title: string;
      email: string;
      phone: string;
      submissionDate: number;
      companyName: string;
      companyAddress: string;

    constructor() {
      this.submissionDate = new Date().getTime();
    }
}
