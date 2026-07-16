class DataTransformer {
  transform(data, type) {
    switch (type) {
      case "auth":
        return this.transformAuthResponse(data);
      case "identity":
      default:
        return data;
    }
  }
  /**
   * Exemplo de transformação: Normaliza a resposta de autenticação
   */
  transformAuthResponse(data) {
    if (data.user && data.token) {
      return {
        ...data,
        bridgeMetadata: {
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          source: "NexusBridge"
        }
      };
    }
    return data;
  }
}
export {
  DataTransformer
};
