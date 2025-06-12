import { Link } from "react-router";
import { useState, useEffect } from "react";

interface HeaderProps {
  date?: string;
}

const Header = (props: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header>
      <h1>Daily Journal</h1>
      <div className="nav-container">
        {props.date && (
          <div className="nav-date">
            <p>{props.date}</p>
          </div>
        )}
        <Link to="/">
          <button className="main-btn">Home</button>
        </Link>
        <Link to="/login">
          <button className="main-btn">Login</button>
        </Link>
        <div className="theme-switch">
          <span>Night mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </header>
  );
};

export default Header;
