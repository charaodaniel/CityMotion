
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged; 
const { fork } = require('child_process');
const fs = require('fs');

let backendProcess;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#111111',
            symbolColor: '#ffffff',
            height: 32
        },
        backgroundColor: '#0a0a0a',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // In desktop mode, we always try to reach the local production or dev port
    const startUrl = isDev
        ? 'http://localhost:9002'
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.setMenu(null);
        mainWindow.maximize(); // Totem default behavior
    }
}

function startBackend() {
    console.log('[Electron]: Iniciando Kernel CityMotion (Node.js)...');
    const backendPath = path.join(__dirname, '../backend/server.js');
    
    backendProcess = fork(backendPath, [], {
        env: { ...process.env, NODE_ENV: 'production' },
        stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
        console.error('[Electron]: Erro crítico no Kernel:', err);
    });
}

app.whenReady().then(() => {
    // No modo Totem/WPA Desktop, o backend roda embutido
    startBackend();

    // Pequeno delay para garantir que o express subiu antes de abrir a janela
    setTimeout(createWindow, 2000);

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        if (backendProcess) backendProcess.kill();
        app.quit();
    }
});

app.on('before-quit', () => {
    if (backendProcess) backendProcess.kill();
});

ipcMain.handle('get-api-config', async () => {
    try {
        const configPath = path.join(__dirname, 'api.config.json');
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { serverIp: '127.0.0.1' };
    }
});
