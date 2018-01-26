export class IAASProvider {

    id: string;
    name: string;

  public static getIAASProviderList(): Array<IAASProvider> {

    const result: Array<IAASProvider> = [
      { id: 'AMAZON_WEB_SERVICES', name: 'Amazon Web Services' },
      { id: 'GOOGLE_CLOUD_PLATFORM', name: 'Google Cloud Platform' },
      { id: 'MICROSOFT_AZURE', name: 'Microsoft Azure' },
      { id: 'OTHER', name: 'Other' }
    ];

    return result;
  }
}
