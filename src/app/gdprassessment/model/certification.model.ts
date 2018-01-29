export class Certification {

    public id: string;
    public name: string;

    public static getCertificationList(): Array<Certification> {
      const result: Array<Certification> = [
          { id: 'NONE', name: 'None' },
          { id: 'ISO', name: 'ISO' },
          { id: 'PCI', name: 'PCI' },
          { id: 'HIPAA', name: 'HIPAA' },
          { id: 'US_FEDERAL', name: 'US Federal' }
        ];

      return result;
    }
}
