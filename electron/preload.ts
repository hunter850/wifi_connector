import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

export const electronContext = {
    ipcRenderer: {
        invoke: ipcRenderer.invoke,
        postMessage: ipcRenderer.postMessage,
        send: ipcRenderer.send,
        sendSync: ipcRenderer.sendSync,
        sendTo: ipcRenderer.sendTo,
        sendToHost: ipcRenderer.sendToHost,
    },
    listenWindowSizeStatus: (cb: (message: string) => void) => {
        function triggerHandler(event: IpcRendererEvent, message: string) {
            console.log(message);
            cb(message);
        }
        ipcRenderer.on("window-size-status", triggerHandler);
        return () => {
            ipcRenderer.removeListener("window-size-status", triggerHandler);
        };
    },
};

contextBridge.exposeInMainWorld("electron", electronContext);
