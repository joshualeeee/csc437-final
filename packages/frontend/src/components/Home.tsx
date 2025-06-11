import { Link } from "react-router";
import { useState } from "react";
import Header from "./Header";

const Home = () => {
  // TODO: Replace with actual API call
  const [affirmation] = useState("I am capable of achieving my goals.");

  return (
    <>
      <Header />
      <div className="content-container">
        <div className="affirmation-container">
          <h2>{affirmation}</h2>
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
    </>
  );
};

export default Home;
