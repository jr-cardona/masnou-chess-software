import {ipcMain, Menu} from 'electron';

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Restart Tournament',
                click: () => {
                    ipcMain.emit('restart-tournament');
                }
            },
            {role: 'quit'},
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                click: (menuItem, browserWindow) => {
                    ipcMain.emit('perform-undo');
                    browserWindow.webContents.send('perform-undo');
                }
            }
        ],
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forceReload'},
            {type: 'separator'},
            {role: 'resetZoom'},
            {role: 'zoomIn'},
            {role: 'zoomOut'},
            {type: 'separator'},
            {role: 'togglefullscreen'},
        ]
    },
    {
        label: 'Settings',
        submenu: [
            {
                label: 'Open Settings',
                accelerator: 'CmdOrCtrl+,',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send('open-settings');
                }
            },
            {
                label: 'Open Statistics',
                accelerator: 'CmdOrCtrl+.',
                click: (menuItem, browserWindow) => {
                    browserWindow.webContents.send('open-statistics');
                }
            }
        ]
    }
]

export const createAppMenu = () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};