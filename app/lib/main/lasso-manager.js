'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const screen = electron.screen;
const fit = require('aspect-fit');
const fill = require('aspect-fill');
const imageSize = require('image-size-async');
const data = require('data');

let lassoWindow;

exports.launch = (photoPath) => {

    if (lassoWindow) {
        return;
    }

    data.photo = photoPath;

    let display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    let dispWidth = Math.round(display.workAreaSize.width - display.workAreaSize.width * .10);
    let dispHeight = Math.round(display.workAreaSize.height - display.workAreaSize.height * .10);

    imageSize(photoPath)
        .then((size) => {

            let f = fit(size.width, size.height, dispWidth, dispHeight);

            f.width = Math.round(f.width);
            f.height = Math.round(f.height);

            data.fit = f;

            lassoWindow = new BrowserWindow({
                'width': f.width,
                'height': f.height,
                'resizable': false,
                'maximizable': false,
                'fullscreenable': false,
                'useContentSize': true
            });

//             lassoWindow.webContents.openDevTools({
//                 'mode': 'detach'
//             });

            lassoWindow.loadURL(`file://${__dirname}/../../lasso.html`);

            lassoWindow.on('closed', () => {
                lassoWindow = null;
            });

        });

};
