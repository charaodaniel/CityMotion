
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
            color: '#222222',
            symbolColor: '#ffffff',
            height: 32
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const startUrl = isDev
        ? 'http://localhost:9002'
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.setMenu(null);
    }
}

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

app.whenReady().then(() => {
    if (!isDev) { 
      startBackend();
    }

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

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

ipcMain.handle('get-api-config', async () => {
    try {
        const configPath = path.join(__dirname, 'api.config.json');
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler api.config.json:', error);
        return { serverIp: '' };
    }
});
