import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserContext } from "../UserContext";

// design
import {
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// functions
import { login } from "../api/user";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message);
        setUser(res.username);

        //redirect to the home page
        navigate("/");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
      <div className="text-center mb-3 alert-light bg-dark">
        <label htmlFor="" className="h2">
          Log In
        </label>
      </div>

      <div className="form-group">
        <TextField
          size="small"
          variant="outlined"
          className="form-control"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group mt-3">
        <FormControl variant="outlined" size="small" className="form-control">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <div className="text-center mt-4">
        <Button
          variant="contained"
          disabled={!email || !password}
          onClick={handleLogin}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Login;
