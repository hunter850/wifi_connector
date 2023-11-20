import { Fragment, useState } from "react";
// mui
import Button from "@mui/material/Button";
import SignalWifi1BarIcon from "@mui/icons-material/SignalWifi1Bar";
import SignalWifi2BarIcon from "@mui/icons-material/SignalWifi2Bar";
import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import SignalWifi4BarIcon from "@mui/icons-material/SignalWifi4Bar";
// utils
const { ipcRenderer } = window.electron;
// types
import type { WiFiNetwork } from "node-wifi";

function FrontPage(): JSX.Element {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [wifiList, setWifiList] = useState<WiFiNetwork[]>([]);
    async function getCurrentWifi() {
        const currentWifi: WiFiNetwork[] = await ipcRenderer.invoke("get-current-wifi");
        console.log("currentWifi: ", currentWifi);
    }
    async function getWifiList() {
        setIsSearching(true);
        const wifiListResult: WiFiNetwork[] = await ipcRenderer.invoke("get-wifi-list");
        console.log(
            "wifiList: ",
            [...wifiListResult].sort((a, b) => b.quality - a.quality)
        );
        setWifiList(wifiListResult.sort((a, b) => b.quality - a.quality));
        setIsSearching(false);
    }
    return (
        <Fragment>
            <h1>FrontPage</h1>
            <Button onClick={getCurrentWifi}>get current wifi</Button>
            <Button onClick={getWifiList}>get wifi list</Button>
            {isSearching ? (
                <h1>Searching...</h1>
            ) : (
                <ul>
                    {wifiList.map((wifi) => {
                        return (
                            <li key={wifi.ssid} style={{ display: "flex" }}>
                                <p>{wifi.ssid}</p>
                                {wifi.quality < 25 ? (
                                    <SignalWifi1BarIcon />
                                ) : wifi.quality < 50 ? (
                                    <SignalWifi2BarIcon />
                                ) : wifi.quality < 75 ? (
                                    <SignalWifi3BarIcon />
                                ) : (
                                    <SignalWifi4BarIcon />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </Fragment>
    );
}

export default FrontPage;
