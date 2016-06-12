'use strict';

let path = require('path');
require('module').globalPaths.push(path.resolve(__dirname, '..'));

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {

    mainWindow = new BrowserWindow({
        'width': 300,
        'height': 300
    });

    let DropHandler = require('./drop-handler');
    let dropHandler = new DropHandler();
    let lassoManager = require('./lasso-manager');

    dropHandler.on('dropped', (photoPath) => {
        lassoManager.launch(photoPath);
    });

    mainWindow.loadURL(`file://${__dirname}/../../index.html`);

//     mainWindow.webContents.openDevTools({
//         'mode': 'detach'
//     });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
