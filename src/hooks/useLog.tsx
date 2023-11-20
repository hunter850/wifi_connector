import { useEffect } from "react";

const useLog = (...value: any[]) => {
    useEffect(() => {
        console.log(...value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...value]);
};

export default useLog;
