/* React 18 不支援 ie 11 若需要支援 ie 11 請使用 React 17.0.2 版本 */

// 根據 .browserslistrc 設定決定支援的瀏覽器 自動加入 polyfill
import "core-js/stable";
import "regenerator-runtime/runtime";

import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
