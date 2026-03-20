import React, { useEffect, useState } from "react";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState("");

  const navigate = useNavigate();
  const barerToken = sessionStorage.getItem("auth-token");
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/app");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const headers = { "Content-Type": "application/json" };
      if (barerToken) headers["Authorization"] = `Bearer ${barerToken}`;

      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        setIncorrect("Server error. Try again later.");
        return;
      }

      const json = await res.json();

      if (json.authtoken) {
        sessionStorage.setItem("auth-token", json.authtoken);
        sessionStorage.setItem("name", json.userName);
        sessionStorage.setItem("email", json.email);

        setIsLoggedIn(true);

        navigate("/app");
      } else {
        setEmail("");
        setPassword("");
        setIncorrect("Wrong email oe password");
        setTimeout(() => setIncorrect(""), 2000);
      }
    } catch (error) {
      console.error(error);
      setIncorrect("Network error. Try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIncorrect("");
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIncorrect("");
                }}
              />

              <span
                style={{
                  color: "red",
                  height: ".5cm",
                  display: "block",
                  fontStyle: "italic",
                  fontSize: "12px",
                }}
              >
                {incorrect}
              </span>
            </div>
            <div className="input-group mb-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <p className="mt-4 text-center">
              New here?{" "}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
