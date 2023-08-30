import React, { useState } from "react";
import "../styles/LogIn.css";
import DogImg from "../assets/my-image.png";
import {
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LogInResponse {
  accessToken: string;
}

const LogIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOpen(false);

    try {
      const response = await axios.post<LogInResponse>(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          name,
          email,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Succesful, Access Token:", response);
        navigate("/search");
      } else {
        console.error("Login failed");
        setLoading(false);
        setOpen(true);
        setError("Login failed, try again");
      }
    } catch (error: any) {
      console.error("Error: ", error);
      setLoading(false);
      setOpen(true);
      setError(`Error: ${error.message}`);
    }
  };
  axios.defaults.withCredentials = true;

  return (
    <div className="login-container">
      <div className="dog-img-container">
        <img id="login-img" src={DogImg} alt="My doggo" />
      </div>
      <div className="form-container">
        <h1>Hi, Welcome Back!</h1>
        <p>Please enter your details 🐶 {loading}</p>
        <form onSubmit={handleLogIn}>
          <TextField
            required
            fullWidth
            id="inpt-name"
            label="Name"
            size="medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="inpt-email"
            label="Email"
            type="email"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            {loading ? (
              <CircularProgress style={{ color: "#FFA900" }} />
            ) : (
              <Button
                type="submit"
                disabled={false}
                size="large"
                variant="contained"
                style={{
                  backgroundColor: "#FFA900",
                  marginTop: "16px",
                }}
              >
                Log In
              </Button>
            )}
            <Snackbar open={open} autoHideDuration={6000}>
              <Alert severity="error" sx={{ width: "100%" }}>
                {error}
              </Alert>
            </Snackbar>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
