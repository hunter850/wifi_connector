"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function registWindowSizeStatusHandler(win) {
    win.on("maximize", () => {
        win.webContents.send("window-size-status", "maximize");
    });
    win.on("unmaximize", () => {
        win.webContents.send("window-size-status", "unmaximize");
    });
    electron_1.ipcMain.handle("check-window-is-maximize", () => {
        return win.isMaximized();
    });
    electron_1.ipcMain.handle("resize-window", (event, action) => {
        switch (action) {
            case "minimize":
                win.minimize();
                break;
            case "maximize":
                win.maximize();
                break;
            case "unmaximize":
                win.unmaximize();
                break;
            default:
                break;
        }
    });
    electron_1.ipcMain.handle("close-window", () => {
        win.close();
    });
}
exports.default = registWindowSizeStatusHandler;
