import {app, BrowserWindow} from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.maximize();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event) => {
        event.preventDefault()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
