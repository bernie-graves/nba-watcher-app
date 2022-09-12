import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import React from "react";

import { UserContext } from "./UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./components/Header";
import { useState, useEffect } from "react";

// functions
import { getUser } from "./api/user";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = getUser()
      .then((res) => {
        if (res.error) console.log(res.error);
        else setUser(res.username);
      })
      .catch((err) => toast(err));

    return () => unsubscribe;
  }, []);

  return (
    <div>
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <ToastContainer autoClose={1500} />
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
};

export default App;
