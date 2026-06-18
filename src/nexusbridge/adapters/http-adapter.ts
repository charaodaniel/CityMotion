
/**
 * Adaptador para requisições HTTP REST
 */

export interface HttpAdapterOptions {
  url: string;
  method: string;
  body?: any;
  headers?: any;
}

export class HttpAdapter {
  async execute(options: HttpAdapterOptions) {
    const { url, method, body, headers } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return {
      status: response.status,
      data
    };
  }
}
