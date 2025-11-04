const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { fork } = require('child_process');
const fs = require('fs');

let backendProcess;

// Função para criar a janela principal
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Carrega a URL da aplicação Next.js
    const startUrl = isDev
        ? 'http://localhost:9002' // URL de desenvolvimento do Next.js
        : `file://${path.join(__dirname, '../out/index.html')}`; // Caminho para o build de produção

    mainWindow.loadURL(startUrl);

    // Abre o DevTools se estiver em modo de desenvolvimento
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

// Inicia o servidor de backend como um processo filho
function startBackend() {
    const backendPath = path.join(__dirname, '../backend/server.js');
    backendProcess = fork(backendPath);

    backendProcess.on('message', (msg) => {
        console.log('Mensagem do backend:', msg);
    });

    backendProcess.on('error', (err) => {
        console.error('Erro no processo do backend:', err);
    });
}

// Evento disparado quando o Electron está pronto
app.whenReady().then(() => {
    // Inicia o servidor Node.js antes de criar a janela
    if (!isDev) { // Em produção, o Electron gerencia o servidor
      startBackend();
    }

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Evento para encerrar a aplicação em todas as plataformas
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        if (backendProcess) {
            backendProcess.kill();
        }
        app.quit();
    }
});

app.on('before-quit', () => {
    if (backendProcess) {
        backendProcess.kill();
    }
});


// IPC para ler a configuração da API
ipcMain.handle('get-api-config', async () => {
    try {
        const configPath = path.join(__dirname, 'api.config.json');
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler api.config.json:', error);
        // Retorna uma configuração padrão em caso de erro
        return { serverIp: '' };
    }
});
