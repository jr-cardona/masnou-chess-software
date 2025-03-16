import {Menu} from 'electron';

const template = [
    {
        label: 'File',
        submenu: [
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
                    browserWindow.webContents.send('perform-undo');
                }
            }
        ],
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'}, // @ToDo remove in production
            {role: 'forceReload'}, // @ToDo remove in production
            {role: 'toggleDevTools'}, // @ToDo remove in production
            {type: 'separator'}, // @ToDo remove in production
            {role: 'resetZoom'}, // @ToDo remove in production
            {role: 'zoomIn'}, // @ToDo remove in production
            {role: 'zoomOut'}, // @ToDo remove in production
            {type: 'separator'}, // @ToDo remove in production
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