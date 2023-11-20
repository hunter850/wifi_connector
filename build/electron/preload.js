"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.electronContext = void 0;
const electron_1 = require("electron");
exports.electronContext = {
    ipcRenderer: {
        invoke: electron_1.ipcRenderer.invoke,
        postMessage: electron_1.ipcRenderer.postMessage,
        send: electron_1.ipcRenderer.send,
        sendSync: electron_1.ipcRenderer.sendSync,
        sendTo: electron_1.ipcRenderer.sendTo,
        sendToHost: electron_1.ipcRenderer.sendToHost,
    },
    listenWindowSizeStatus: (cb) => {
        function triggerHandler(event, message) {
            console.log(message);
            cb(message);
        }
        electron_1.ipcRenderer.on("window-size-status", triggerHandler);
        return () => {
            electron_1.ipcRenderer.removeListener("window-size-status", triggerHandler);
        };
    },
};
electron_1.contextBridge.exposeInMainWorld("electron", exports.electronContext);
