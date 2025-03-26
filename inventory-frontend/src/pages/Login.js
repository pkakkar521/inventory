import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaTwitter, FaGithub, FaGoogle } from "react-icons/fa"; // Social Media Icons
import "./Login.css"; // Import CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.role === "user1") {
        navigate("/user1");
      } else if (response.data.role === "user2") {
        navigate("/user2");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container" style={{ display: "flex", height: "100vh" }}>
      {/* Left side with full background image */}
      <div
        className="login-left"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/un.png)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          flex: "0.45", // Adjusted size to avoid cutting
          height: "100%",
        }}
      ></div>

      {/* Right side with Login Card */}
      <div className="login-right" style={{ flex: "0.55", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="login-card">
          <h2>Welcome to Inventory!</h2>
          <p>Please sign in to continue</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          <button onClick={handleLogin}>LOGIN</button>

          <p className="create-account">
            New to our platform? <a href="#">Create an account</a>
          </p>

          <div className="social-icons">
            <FaFacebookF className="icon facebook" />
            <FaTwitter className="icon twitter" />
            <FaGithub className="icon github" />
            <FaGoogle className="icon google" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



