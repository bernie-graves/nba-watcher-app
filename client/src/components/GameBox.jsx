import "../App.css";
import React, { useEffect, useReducer } from "react";
import TweetFeed from "./TweetFeed";

const GameBox = () => {
  const rulesURL = "/api/rules";

  // get current rules function
  const getCurrentRules = () => {};

  // delete current rules
  const deleteAllRules = () => {
    // get current rules ids

    // setup request payload to delete rules

    // send request to Twitter API

    return;
  };

  // add new rules
  const createRules = () => {
    return;
  };

  const handleClick = () => {
    // delete current rules
    deleteAllRules();

    // add new rules for each team
    createRules();
  };

  return (
    <div className="GameBox">
      <div className="row">
        <div className="col-8">
          <div id="HomeTeam">
            <h4>Padres</h4>
          </div>
          <div id="AwayTeam">
            <h4>Diamondbacks</h4>
          </div>
        </div>
        <div className="col-4">
          <button onClick={handleClick} style={{ marginTop: "1.2rem" }}>
            Watch
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBox;
