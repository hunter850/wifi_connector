"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const wifi = require("node-wifi");
function initWifiModule() {
    wifi.init({
        iface: null,
    });
}
function getCurrentWifi() {
    return new Promise((resolve, reject) => {
        wifi.getCurrentConnections((error, currentConnections) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(currentConnections);
            }
        });
    });
}
function getWifiList() {
    return new Promise((resolve, reject) => {
        wifi.scan((error, networks) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(networks);
            }
        });
    });
}
function connectWifi({ ssid, password }) {
    return new Promise((resolve, reject) => {
        wifi.connect({ ssid, password }, () => {
            (() => __awaiter(this, void 0, void 0, function* () {
                const currentWifi = yield getCurrentWifi();
                if (currentWifi.length > 0) {
                    resolve(true);
                }
                else {
                    reject(`Fail to connect wifi`);
                }
            }))();
        });
    });
}
function tryAutoConnect({ ssid, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentWifi = yield getCurrentWifi();
            if (currentWifi.length > 0 && currentWifi[0].ssid === ssid) {
                console.log("Already connected");
            }
            else {
                const wifiList = yield getWifiList();
                console.log("wifi list: ", wifiList);
                const targetWifi = wifiList.find((wifi) => wifi.ssid === ssid);
                if (targetWifi === undefined) {
                    console.log(`Cannot find wifi named ${ssid}`);
                }
                else {
                    const connectResult = yield connectWifi({ ssid, password });
                    if (connectResult) {
                        console.log("Connnect successfully");
                    }
                }
            }
        }
        catch (error) {
            console.log("connect error: ", error);
        }
    });
}
function registWifiHandler() {
    initWifiModule();
    electron_1.ipcMain.handle("get-current-wifi", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const currentWifi = yield getCurrentWifi();
            if (currentWifi.length > 0) {
                return currentWifi;
            }
            else {
                return [];
            }
        }
        catch (error) {
            console.log("error: ", error);
            return [];
        }
    }));
    electron_1.ipcMain.handle("get-wifi-list", () => __awaiter(this, void 0, void 0, function* () {
        try {
            // const wifiList = await getWifiList();
            const wifiList = yield wifi.scan();
            console.log("wifiList: ", wifiList);
            const wifiDict = {};
            if (wifiList.length > 0) {
                wifiList.forEach((wifi) => {
                    if (wifiDict[wifi.ssid]) {
                        if (wifiDict[wifi.ssid].quality < wifi.quality) {
                            wifiDict[wifi.ssid] = wifi;
                        }
                    }
                    else {
                        wifiDict[wifi.ssid] = wifi;
                    }
                });
                return Object.values(wifiDict);
            }
            else {
                return [];
            }
        }
        catch (error) {
            console.log("error: ", error);
            return [];
        }
    }));
    electron_1.ipcMain.handle("connect-wifi", (event, { ssid, password }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const success = yield connectWifi({ ssid, password });
            if (success) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log("error: ", error);
            return false;
        }
    }));
}
exports.default = registWifiHandler;
