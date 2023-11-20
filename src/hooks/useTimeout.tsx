import { useRef, useCallback, useEffect } from "react";

function useTimeout() {
    const flagRef = useRef<number | null>(null);
    const canRunRef = useRef(true);
    useEffect(() => {
        return () => {
            if (flagRef !== null && flagRef.current !== null) {
                cancelAnimationFrame(flagRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [
        useCallback((callback: (...args: any[]) => any, tick: number, start: number | undefined) => {
            canRunRef.current = true;
            (function step(timestamp?: number) {
                if (canRunRef.current) {
                    if (!start) {
                        start = timestamp;
                        flagRef.current = window.requestAnimationFrame(step);
                        return;
                    }
                    const progress = timestamp ? timestamp - start : 0;
                    if (progress < tick) {
                        flagRef.current = window.requestAnimationFrame(step);
                        return;
                    }
                    callback();
                }
            })();
        }, []),
        useCallback(() => {
            canRunRef.current = false;
            if (flagRef !== null && flagRef.current !== null) {
                cancelAnimationFrame(flagRef.current);
            }
        }, []),
    ];
}

export default useTimeout;
