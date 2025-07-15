import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Tasks from './pages/Tasks';

function App() {
    // Simple routing based on current pathname
    const getCurrentPage = () => {
        const path = window.location.pathname;
        
        switch (path) {
            case '/':
                return <Home />;
            case '/tasks':
                return <Tasks />;
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