"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
// lib
const registWindowSizeStatusHandler_1 = require("./handlers/registWindowSizeStatusHandler");
const registWifiHandler_1 = require("./handlers/registWifiHandler");
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    if (electron_1.app.isPackaged) {
        win.loadFile("./build/index.html");
    }
    else {
        win.loadURL("http://localhost:3000");
    }
    (0, registWindowSizeStatusHandler_1.default)(win);
    (0, registWifiHandler_1.default)();
    // show window without setting focus
    win.showInactive();
    // Open the DevTools.
    // win.webContents.openDevTools();
};
electron_1.app.whenReady().then(() => {
    if (require("electron-squirrel-startup"))
        electron_1.app.quit();
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
