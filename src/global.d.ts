import { electronContext } from "../electron/preload";

declare global {
    interface Window {
        electron: typeof electronContext;
    }
    type ValueOf<T> = T[keyof T];
    type AnyFunction = (...arg: any[]) => any;
}
