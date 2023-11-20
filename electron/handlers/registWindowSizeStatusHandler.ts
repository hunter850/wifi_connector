import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";

function registWindowSizeStatusHandler(win: BrowserWindow) {
    win.on("maximize", () => {
        win.webContents.send("window-size-status", "maximize");
    });

    win.on("unmaximize", () => {
        win.webContents.send("window-size-status", "unmaximize");
    });

    ipcMain.handle("check-window-is-maximize", () => {
        return win.isMaximized();
    });

    ipcMain.handle("resize-window", (event, action) => {
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

    ipcMain.handle("close-window", () => {
        win.close();
    });
}

export default registWindowSizeStatusHandler;
