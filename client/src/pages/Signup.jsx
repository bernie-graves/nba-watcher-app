import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// design
import {
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
  FormHelperText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// functions
import { register } from "../api/user";

const Signup = () => {
  const navigate = useNavigate();

  // form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // password validation
  let hasEightChar = password.length >= 8;
  let hasLowerChar = /(.*[a-z].*)/.test(password);
  let hasUpperChar = /(.*[A-Z].*)/.test(password);
  let hasNumber = /(.*[0-9].*)/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await register({ username, email, password });
      if (res.error) toast.warning(res.error);
      else {
        toast.success(res.message);
        // redirect to login page
        navigate("/login");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
      <div className="text-center mb-3 alert-light bg-dark">
        <label htmlFor="" className="h2">
          Sign Up
        </label>
      </div>

      <div className="form-group mb-3">
        <TextField
          size="small"
          variant="outlined"
          className="form-control"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
      <div className="form-group mt-3 mb-3">
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
        {password && (
          <div className="ml-1" style={{ columns: 2 }}>
            <div>
              <small className={hasEightChar ? "text-success" : "text-danger"}>
                at least 8 characters
              </small>
            </div>
            <div>
              <small className={hasLowerChar ? "text-success" : "text-danger"}>
                at least 1 lower case letter
              </small>
            </div>
            <div>
              <small className={hasUpperChar ? "text-success" : "text-danger"}>
                at least 1 upper case letter
              </small>
            </div>
            <div>
              <small className={hasNumber ? "text-success" : "text-danger"}>
                at least 1 number
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <TextField
          size="small"
          type="password"
          variant="outlined"
          className="form-control"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {password && confirmPassword && (
        <FormHelperText>
          {password === confirmPassword ? (
            <span className="text-success">Password does match</span>
          ) : (
            <span className="text-danger">Password does not match</span>
          )}
        </FormHelperText>
      )}
      <div className="text-center mt-4">
        <Button
          variant="contained"
          disabled={
            !email ||
            !password ||
            !username ||
            !confirmPassword ||
            password !== confirmPassword ||
            !hasEightChar ||
            !hasLowerChar ||
            !hasNumber ||
            !hasUpperChar
          }
          onClick={handleRegister}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Signup;
