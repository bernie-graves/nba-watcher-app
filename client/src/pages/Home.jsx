import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import TweetFeed from "../components/TweetFeed";
import RuleList from "../components/RuleList";
import GameBox from "../components/GameBox";
import "../App.css";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div
      className="container text-center"
      style={{ width: "1920px", minWidth: "1900px", margin: "auto" }}
    >
      <div className="alert alert-primary p-5">
        <h1>NBA Watcher Home</h1>
        <h1>welcome {user}</h1>
      </div>
      <div className="row">
        <div className="col-8">
          <h2>Scores</h2>
          <div className="alert alert-primary">
            <h5>No games </h5>
            <iframe
              src="http://weakstreams.com/streams/9864541"
              allowfullscreen="true"
              height="700"
              width="100%"
            ></iframe>
            <GameBox />
          </div>
        </div>
        <div className="col-4">
          <h2>Tweets</h2>
          <div className="alert alert-primary">
            <h5>Select a game to start streaming tweets</h5>
            <TweetFeed />
            <RuleList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
