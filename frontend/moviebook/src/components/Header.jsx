// src/components/Header.js
import React from 'react';
import { Film, User, LogOut } from 'lucide-react';
import '../App.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <Film size={32} />
          <h1>Movie Platform</h1>
        </div>
        <div className="header-right">
          <span className="user-name">
            <User size={20} />
            {user?.name}
          </span>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;