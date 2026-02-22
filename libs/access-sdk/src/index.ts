import { OpenAPIClientAxios, OpenAPIV3 } from 'openapi-client-axios';
import type { Client } from './client';
import definition from './definition.json';

class Access {
  private api: OpenAPIClientAxios;

  public sdk: Client;

  constructor(serverUrl?: string, accessToken?: string) {
    this.api = new OpenAPIClientAxios({
      definition: definition as OpenAPIV3.Document,
      axiosConfigDefaults: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    this.sdk = this.api.initSync<Client>();
    if (serverUrl) {
      this.init(serverUrl, accessToken);
    }
  }

  init(serverUrl: string, accessToken?: string) {
    this.api.withServer({
      url: serverUrl,
      description: 'Access Request System Server',
    });
    this.sdk = this.api.initSync<Client>();

    if (accessToken) this.authorize(accessToken);

    // eslint-disable-next-line no-console
    console.log(
      `Access SDK initialized over ${serverUrl} and key ${
        accessToken ? `...${accessToken.slice(-4)}` : 'not provided'
      }`
    );
  }

  authorize(accessToken: string) {
    this.api.client.defaults.headers['authorization'] = `Bearer ${accessToken}`;
  }

  unauthorize() {
    delete this.api.client.defaults.headers['authorization'];
  }
}

const access = new Access();

export function authorize(token: string) {
  access.authorize(token);
}

export function init(serverUrl: string, accessToken?: string) {
  access.init(serverUrl, accessToken);
}

export const { sdk } = access;
