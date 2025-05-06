import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const [isDark, setIsDark] = React.useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.body.setAttribute('data-theme', !isDark ? 'dark' : 'light');
    };

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle; 