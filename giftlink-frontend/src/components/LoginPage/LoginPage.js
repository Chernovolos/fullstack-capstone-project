import React, { useEffect, useState } from "react";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem("auth-token");
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/app");
    }
  }, [navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email address";
      case "password":
        return value ? "" : "Password is required";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    setIncorrect("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleFocus = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const isDisabled =
    !email || !password || Object.values(errors).some((e) => e !== "");

  const handleBlur = (name, value) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      const headers = { "Content-Type": "application/json" };
      if (bearerToken) headers["Authorization"] = `Bearer ${bearerToken}`;
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.status === 401) {
        setIncorrect("Wrong email or password");
        setTimeout(() => setIncorrect(""), 2000);
        return;
      }

      if (!res.ok) {
        setIncorrect("Server error. Try again later.");
        return;
      }

      sessionStorage.setItem("auth-token", data.authToken);
      sessionStorage.setItem("name", data.firstName);
      sessionStorage.setItem("email", data.email);

      setIsLoggedIn(true);
      navigate("/app");
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

            {incorrect && (
              <div className="alert alert-danger" role="alert">
                {incorrect}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email", email)}
              />
              {touched.email && errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Enter your password"
                value={password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password", password)}
              />
              {touched.password && errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="input-group mb-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleLogin}
                disabled={isDisabled}
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
