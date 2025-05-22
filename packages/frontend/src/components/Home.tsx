import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="content-container">
      <div className="affirmation-container">
        <h2>I am capable of achieving my goals.</h2>
      </div>
      <div className="button-container">
        <Link to="/write">
          <button className="main-btn">Write</button>
        </Link>
        <Link to="/view">
          <button className="main-btn">Calendar View</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
