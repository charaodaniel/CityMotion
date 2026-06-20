
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
    // O Next.js Route Handler repassa headers que fazem o fetch do servidor falhar ao recalcular o body
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
      // Cache: 'no-store' para garantir dados frescos do backend
      cache: 'no-store'
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      // Garantimos que o corpo é enviado como uma string JSON limpa
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
      
      // Se falhar a conexão (ex: backend desligado), retornamos um erro amigável
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        return {
          status: 503,
          data: { 
            error: "Backend indisponível", 
            message: "Não foi possível conectar ao servidor em " + url,
            hint: "Verifique se o backend Node está rodando na porta correta (3001)."
          }
        };
      }
      
      throw error;
    }
  }
}
