class HttpAdapter {
  async execute(options) {
    const { url, method, body, headers } = options;
    const {
      host,
      connection,
      "content-length": contentLength,
      "content-type": contentType,
      ...safeHeaders
    } = headers || {};
    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...safeHeaders
      },
      cache: "no-store"
    };
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(body);
    }
    try {
      console.log(`[NexusBridge Adapter] Executing: ${method} ${url}`);
      const response = await fetch(url, fetchOptions);
      const responseData = await response.json().catch(() => ({
        message: "A resposta n\xE3o \xE9 um JSON v\xE1lido.",
        status: response.status
      }));
      if (!response.ok) {
        console.error(`[NexusBridge Adapter] HTTP Error ${response.status}:`, responseData);
      }
      return {
        status: response.status,
        data: responseData
      };
    } catch (error) {
      console.error(`[NexusBridge Adapter] Fetch error for ${url}:`, error.message);
      return {
        status: 503,
        data: {
          error: "Backend indispon\xEDvel",
          message: `N\xE3o foi poss\xEDvel conectar ao servidor em ${url}`,
          hint: "Verifique se o backend Node est\xE1 rodando na porta correta (3001) e se o binding est\xE1 em 0.0.0.0."
        }
      };
    }
  }
}
export {
  HttpAdapter
};
