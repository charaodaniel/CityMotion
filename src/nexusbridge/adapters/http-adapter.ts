
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

    // Filtramos headers problemáticos que podem corromper o body no proxy
    const { 
        host, 
        connection, 
        'content-length': contentLength, 
        'content-type': contentType,
        ...safeHeaders 
    } = headers || {};

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...safeHeaders
      },
      cache: 'no-store'
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      console.log(`[NexusBridge Adapter] Executing: ${method} ${url}`);
      
      const response = await fetch(url, fetchOptions);
      
      const responseData = await response.json().catch(() => ({ 
          message: "A resposta não é um JSON válido.",
          status: response.status 
      }));

      if (!response.ok) {
        console.error(`[NexusBridge Adapter] HTTP Error ${response.status}:`, responseData);
      }

      return {
        status: response.status,
        data: responseData
      };
    } catch (error: any) {
      console.error(`[NexusBridge Adapter] Fetch error for ${url}:`, error.message);
      
      // Se falhar a conexão, retornamos 503 para que o frontend saiba que o backend caiu
      return {
        status: 503,
        data: { 
          error: "Backend indisponível", 
          message: `Não foi possível conectar ao servidor em ${url}`,
          hint: "Verifique se o backend Node está rodando na porta correta (3001) e se o binding está em 0.0.0.0."
        }
      };
    }
  }
}
