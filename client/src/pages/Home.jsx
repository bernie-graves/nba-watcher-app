import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="container text-center" style={{ marginTop: "12rem" }}>
      <div className="alert alert-primary p-5">
        <h1>NBA Watcher Home</h1>
        <h1>welcome {user}</h1>
      </div>
      <div className="row">
        <div className="col-6">
          <h2>Scores</h2>
          <div className="alert alert-primary">
            <h5>No games on</h5>
          </div>
        </div>
        <div className="col-6">
          <h2>Tweets</h2>
          <div className="alert alert-primary">
            <h5>Select a game to start streaming tweets</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
