
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

    // Filtramos o header 'host' pois o Node fetch no servidor
    // pode ter problemas ao passar o host do frontend para o backend local
    const { host, ...safeHeaders } = headers || {};

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...safeHeaders
      },
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      return {
        status: response.status,
        data
      };
    } catch (error: any) {
      console.error(`[HttpAdapter] Fetch error for ${url}:`, error.message);
      throw error;
    }
  }
}
