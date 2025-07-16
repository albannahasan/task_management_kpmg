import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
    const getCurrentPage = () => {
        const path = window.location.pathname;
        
        switch (path) {
            case '/':
                return <Home />;
            default:
                return <Home />;
        }
    };

    return (
        <div>
            <Navbar />
            {getCurrentPage()}
        </div>
    );
}

export default App;