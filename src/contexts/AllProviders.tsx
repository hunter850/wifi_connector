import { ReactNode } from "react";
import BreakPointProvider from "./BreakPointProvider";

interface AllProvidersProps {
    children: ReactNode;
}

function AllProviders(props: AllProvidersProps): JSX.Element {
    const { children } = props;
    return <BreakPointProvider>{children}</BreakPointProvider>;
}

export default AllProviders;
