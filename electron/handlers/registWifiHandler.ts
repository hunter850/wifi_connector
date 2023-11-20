import { ipcMain } from "electron";
import * as wifi from "node-wifi";
// types
import type { WiFiNetwork } from "node-wifi";

function initWifiModule() {
    wifi.init({
        iface: null,
    });
}

function getCurrentWifi(): Promise<WiFiNetwork[]> {
    return new Promise((resolve, reject) => {
        wifi.getCurrentConnections((error, currentConnections) => {
            if (error) {
                reject(error);
            } else {
                resolve(currentConnections);
            }
        });
    });
}

function getWifiList(): Promise<WiFiNetwork[]> {
    return new Promise((resolve, reject) => {
        wifi.scan((error, networks) => {
            if (error) {
                reject(error);
            } else {
                resolve(networks);
            }
        });
    });
}

function connectWifi({ ssid, password }: { ssid: string; password: string }): Promise<boolean> {
    return new Promise((resolve, reject) => {
        wifi.connect({ ssid, password }, () => {
            (async () => {
                const currentWifi = await getCurrentWifi();
                if (currentWifi.length > 0) {
                    resolve(true);
                } else {
                    reject(`Fail to connect wifi`);
                }
            })();
        });
    });
}

async function tryAutoConnect({ ssid, password }: { ssid: string; password: string }) {
    try {
        const currentWifi = await getCurrentWifi();
        if (currentWifi.length > 0 && currentWifi[0].ssid === ssid) {
            console.log("Already connected");
        } else {
            const wifiList = await getWifiList();
            console.log("wifi list: ", wifiList);
            const targetWifi = wifiList.find((wifi) => wifi.ssid === ssid);
            if (targetWifi === undefined) {
                console.log(`Cannot find wifi named ${ssid}`);
            } else {
                const connectResult = await connectWifi({ ssid, password });
                if (connectResult) {
                    console.log("Connnect successfully");
                }
            }
        }
    } catch (error: any) {
        console.log("connect error: ", error);
    }
}

function registWifiHandler() {
    initWifiModule();
    ipcMain.handle("get-current-wifi", async () => {
        try {
            const currentWifi = await getCurrentWifi();
            if (currentWifi.length > 0) {
                return currentWifi;
            } else {
                return [];
            }
        } catch (error: any) {
            console.log("error: ", error);
            return [];
        }
    });
    ipcMain.handle("get-wifi-list", async () => {
        try {
            // const wifiList = await getWifiList();
            const wifiList = await wifi.scan();
            console.log("wifiList: ", wifiList);
            const wifiDict: Record<string, WiFiNetwork> = {};
            if (wifiList.length > 0) {
                wifiList.forEach((wifi) => {
                    if (wifiDict[wifi.ssid]) {
                        if (wifiDict[wifi.ssid].quality < wifi.quality) {
                            wifiDict[wifi.ssid] = wifi;
                        }
                    } else {
                        wifiDict[wifi.ssid] = wifi;
                    }
                });
                return Object.values(wifiDict);
            } else {
                return [];
            }
        } catch (error: any) {
            console.log("error: ", error);
            return [];
        }
    });
    ipcMain.handle("connect-wifi", async (event, { ssid, password }: { ssid: string; password: string }) => {
        try {
            const success = await connectWifi({ ssid, password });
            if (success) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.log("error: ", error);
            return false;
        }
    });
}

export default registWifiHandler;
