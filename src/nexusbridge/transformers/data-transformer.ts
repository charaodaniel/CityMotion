
/**
 * Camada de transformação de dados
 */

export class DataTransformer {
  transform(data: any, type: string) {
    switch (type) {
      case 'auth':
        return this.transformAuthResponse(data);
      case 'identity':
      default:
        return data; // Retorna os dados originais se não houver transformação definida
    }
  }

  /**
   * Exemplo de transformação: Normaliza a resposta de autenticação
   */
  private transformAuthResponse(data: any) {
    if (data.user && data.token) {
      return {
        ...data,
        bridgeMetadata: {
          timestamp: new Date().toISOString(),
          source: "NexusBridge"
        }
      };
    }
    return data;
  }
}
