import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-dark-card border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💸</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              Habit Cost Calculator
            </h1>
          </div>
          
          <div className="flex space-x-4">
            <NavLink to="/" active={isActive('/')}>Dashboard</NavLink>
            <NavLink to="/settings" active={isActive('/settings')}>Settings</NavLink>
            <NavLink to="/help" active={isActive('/help')}>Help</NavLink>
            </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link to={to} className="relative">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'text-neon-blue' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"
        />
      )}
    </motion.div>
  </Link>
);

export default Navbar;