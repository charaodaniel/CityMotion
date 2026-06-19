
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

    // Filtramos headers problemáticos
    const { host, connection, ...safeHeaders } = headers || {};

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...safeHeaders
      },
      // Cache: 'no-store' para garantir dados frescos do backend
      cache: 'no-store'
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      console.log(`[NexusBridge Adapter] Fetching: ${method} ${url}`);
      
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error body');
        console.error(`[NexusBridge Adapter] HTTP Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return {
        status: response.status,
        data
      };
    } catch (error: any) {
      console.error(`[NexusBridge Adapter] Fetch error for ${url}:`, error.message);
      
      // Se falhar a conexão (ex: backend desligado), retornamos um erro amigável
      if (error.message.includes('fetch failed')) {
        return {
          status: 503,
          data: { 
            error: "Backend indisponível", 
            message: "Não foi possível conectar ao servidor em " + url,
            hint: "Verifique se o backend Node está rodando na porta correta."
          }
        };
      }
      
      throw error;
    }
  }
}
