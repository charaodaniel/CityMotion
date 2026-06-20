
/**
 * @fileOverview NexusBridge Core Engine
 * Responsável por gerenciar o fluxo: Request -> Match Route -> Adapter -> Transform -> Response
 */

import config from '../config/nexus-settings.json';
import { HttpAdapter } from '../adapters/http-adapter';
import { DataTransformer } from '../transformers/data-transformer';

export interface NexusBridgeRequest {
  path: string;
  method: string;
  body?: any;
  headers?: any;
}

export class NexusBridge {
  private adapter: HttpAdapter;
  private transformer: DataTransformer;

  constructor() {
    this.adapter = new HttpAdapter();
    this.transformer = new DataTransformer();
  }

  async handleRequest(request: NexusBridgeRequest) {
    // Sanitização do path: remove espaços e barras extras
    const normalizedPath = request.path.trim().replace(/^\//, '').replace(/\/$/, '');
    
    console.log(`[NexusBridge] Processing ${request.method} "${normalizedPath}"`);

    // 1. Encontrar a rota correspondente
    // Primeiro tenta o match exato
    let route = config.routes.find(r => r.path === normalizedPath && r.method === request.method);
    let dynamicId = null;

    // Se não encontrou exato, tenta detectar ID no final (ex: path/123)
    if (!route) {
        const parts = normalizedPath.split('/');
        if (parts.length > 1) {
            const idCandidate = parts.pop();
            const parentPath = parts.join('/');
            
            const potentialRoute = config.routes.find(r => r.path === parentPath && r.method === request.method);
            if (potentialRoute) {
                route = potentialRoute;
                dynamicId = idCandidate;
            }
        }
    }

    if (!route) {
      return {
        status: 404,
        data: { 
            status: 404,
            message: `NexusBridge: Route not found for "${normalizedPath}"`,
            availableRoutes: config.routes.map(r => r.path)
        }
      };
    }

    // 2. Resolver o Backend
    const backend = (config.backends as any)[route.backendId];
    if (!backend) {
      return {
        status: 500,
        data: { status: 500, message: `NexusBridge: Backend ${route.backendId} not configured.` }
      };
    }

    // Monta a URL alvo, anexando o ID dinâmico se houver
    let targetUrl = `${backend.baseUrl}${route.target}`;
    if (dynamicId) {
        targetUrl = `${targetUrl}/${dynamicId}`;
    }

    try {
      // 3. Executar a requisição via Adaptador
      const response = await this.adapter.execute({
        url: targetUrl,
        method: request.method,
        body: request.body,
        headers: request.headers
      });

      // 4. Transformar a Resposta se necessário
      const transformedData = this.transformer.transform(response.data, route.transformer);

      return {
        status: response.status,
        data: transformedData
      };

    } catch (error: any) {
      console.error(`[NexusBridge] Error executing request:`, error);
      return {
        status: 500,
        data: { status: 500, message: "NexusBridge internal execution error.", detail: error.message }
      };
    }
  }
}
