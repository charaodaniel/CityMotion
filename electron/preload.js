const { contextBridge, ipcRenderer } = require('electron');

// Expõe um objeto 'electronAPI' para o processo de renderização (sua aplicação React/Next.js)
// de forma segura.
contextBridge.exposeInMainWorld('electronAPI', {
  // Expõe a função para obter a configuração da API
  getApiConfig: () => ipcRenderer.invoke('get-api-config'),
});
