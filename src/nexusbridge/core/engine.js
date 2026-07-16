import config from "../config/nexus-settings.json";
import { HttpAdapter } from "../adapters/http-adapter";
import { DataTransformer } from "../transformers/data-transformer";
class NexusBridge {
  adapter;
  transformer;
  constructor() {
    this.adapter = new HttpAdapter();
    this.transformer = new DataTransformer();
  }
  async handleRequest(request) {
    const normalizedPath = request.path.trim().replace(/^\//, "").replace(/\/$/, "");
    console.log(`[NexusBridge] Processing ${request.method} "${normalizedPath}"`);
    let route = config.routes.find((r) => r.path === normalizedPath && r.method === request.method);
    let dynamicId = null;
    if (!route) {
      const parts = normalizedPath.split("/");
      if (parts.length > 1) {
        const idCandidate = parts.pop();
        const parentPath = parts.join("/");
        const potentialRoute = config.routes.find((r) => r.path === parentPath && r.method === request.method);
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
          availableRoutes: config.routes.map((r) => r.path)
        }
      };
    }
    const backend = config.backends[route.backendId];
    if (!backend) {
      return {
        status: 500,
        data: { status: 500, message: `NexusBridge: Backend ${route.backendId} not configured.` }
      };
    }
    let targetUrl = `${backend.baseUrl}${route.target}`;
    if (dynamicId) {
      targetUrl = `${targetUrl}/${dynamicId}`;
    }
    try {
      const response = await this.adapter.execute({
        url: targetUrl,
        method: request.method,
        body: request.body,
        headers: request.headers
      });
      const transformedData = this.transformer.transform(response.data, route.transformer);
      return {
        status: response.status,
        data: transformedData
      };
    } catch (error) {
      console.error(`[NexusBridge] Error executing request:`, error);
      return {
        status: 500,
        data: { status: 500, message: "NexusBridge internal execution error.", detail: error.message }
      };
    }
  }
}
export {
  NexusBridge
};
