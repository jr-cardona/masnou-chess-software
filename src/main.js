import {app, BrowserWindow, ipcMain, dialog, screen} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {createAppMenu} from './menu.js';
import * as fs from "node:fs";

if (started) {
    app.quit();
}

const saveFilePath = app.getPath('userData');
let mainWindow = null;
let timerWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1920,
        minHeight: 1080,
        icon: path.join(app.getAppPath(), 'public/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    mainWindow.on('closed', () => {
        if (timerWindow) {
            timerWindow.close();
        }
    });
};

app.whenReady().then(() => {
    createWindow();
    createAppMenu();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event) => {
        event.preventDefault();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('open-timer-window', (event, timerValue) => {
    if (timerWindow) {
        if (timerWindow.isMinimized()) {
            timerWindow.restore();
        }
        timerWindow.focus();
        return;
    }

    timerWindow = new BrowserWindow({
        width: 800,
        height: 200,
        x: 0,
        y: 0,
        icon: path.join(app.getAppPath(), 'public/icon.png'),
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    timerWindow.setMenu(null);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        timerWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/timer.html`);
    } else {
        timerWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/timer.html`));
    }

    timerWindow.webContents.once('did-finish-load', () => {
        timerWindow.webContents.send('update-timer', timerValue);
    });

    timerWindow.on('close', (event) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            event.preventDefault();
            timerWindow.minimize();
        }
    });

    timerWindow.on('closed', () => {
        timerWindow = null;
    });
});

ipcMain.on('update-timer', (event, newTimer) => {
    if (timerWindow) {
        timerWindow.webContents.send('update-timer', newTimer);
    }
});

ipcMain.on('save-excel-file', async (event, fileBuffer) => {
    const {filePath} = await dialog.showSaveDialog({
        title: "Save File",
        defaultPath: path.join(saveFilePath, 'Tournament_Stats.xlsx'),
        filters: [{name: "Excel Files", extensions: ["xlsx"]}]
    });

    if (filePath) {
        fs.writeFileSync(filePath, fileBuffer);
        event.reply("save-success", filePath);
    } else {
        event.reply("save-error", "Error saving file");
    }
});

ipcMain.on('save-tournament', (event, tournamentState) => {
    try {
        fs.writeFileSync(path.join(saveFilePath, 'tournamentV2.1.json'), JSON.stringify(tournamentState, null, 2));
    } catch (error) {
        console.error('Error writing tournament state:', error);
    }
});

ipcMain.handle('load-tournament', () => {
    const filePath = path.join(saveFilePath, 'tournamentV2.1.json');
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return null;
});
