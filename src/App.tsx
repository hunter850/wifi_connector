import AllProviders from "./contexts/AllProviders";
import FrontPage from "./components/FrontPage";

function App(): JSX.Element {
    return (
        <AllProviders>
            <FrontPage />
        </AllProviders>
    );
}

export default App;
