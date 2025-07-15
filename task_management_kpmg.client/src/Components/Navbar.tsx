import React, { useState } from 'react';
import './styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Task Flow</h1>
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        </div>

        <div className="navbar-actions">
          <button className="btn-primary">New Task</button>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
