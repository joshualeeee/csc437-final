import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <h1>Daily Journal</h1>
      <div className="nav-container">
        <Link to="/">
          <button className="main-btn">Home</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
