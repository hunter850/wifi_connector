import React, { ReactNode, useContext, useEffect, useState } from "react";

export const BreakPointContext = React.createContext<number>(
    window.innerWidth <= 576
        ? 0
        : window.innerWidth <= 768
        ? 1
        : window.innerWidth <= 992
        ? 2
        : window.innerWidth <= 1200
        ? 3
        : window.innerWidth <= 1520
        ? 4
        : 5
);

export function useBreakPoint() {
    return useContext(BreakPointContext);
}

interface BreakPointProviderProps {
    children: ReactNode;
}

function BreakPointProvider(props: BreakPointProviderProps): JSX.Element {
    const [breakPoint, setBreakPoint] = useState<number>(
        window.innerWidth <= 576
            ? 0
            : window.innerWidth <= 768
            ? 1
            : window.innerWidth <= 992
            ? 2
            : window.innerWidth <= 1200
            ? 3
            : window.innerWidth <= 1520
            ? 4
            : 5
    );
    useEffect(() => {
        function resizeHandler() {
            if (window.innerWidth <= 576) {
                setBreakPoint(0);
            } else if (576 < window.innerWidth && window.innerWidth <= 768) {
                setBreakPoint(1);
            } else if (768 < window.innerWidth && window.innerWidth <= 992) {
                setBreakPoint(2);
            } else if (992 < window.innerWidth && window.innerWidth <= 1200) {
                setBreakPoint(3);
            } else if (1200 < window.innerWidth && window.innerWidth <= 1520) {
                setBreakPoint(4);
            } else {
                setBreakPoint(5);
            }
        }
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);
    const { children } = props;
    return <BreakPointContext.Provider value={breakPoint}>{children}</BreakPointContext.Provider>;
}

export default BreakPointProvider;
