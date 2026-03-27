import React, { useState } from "react";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName } = useAppContext();

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "Min 2 characters";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Min 2 characters";
        return "";

      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email address";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Add uppercase letter";
        if (!/[a-z]/.test(value)) return "Add lowercase letter";
        if (!/[0-9]/.test(value)) return "Add number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Add special character";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setServerError("");
  };

  const handleFocus = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name, value) => {
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isDisabled =
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    Object.values(errors).some((e) => e !== "");

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      email: validateField("email", email),
      password: validateField("password", password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      const response = await fetch(
        `${urlConfig.backendUrl}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        },
      );
      const json = await response.json();

      if (json.errors) {
        const fieldErrors = {};

        json.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });

        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        return;
      }

      if (json.authToken) {
        sessionStorage.setItem("auth-token", json.authToken);
        sessionStorage.setItem("name", firstName);
        sessionStorage.setItem("email", json.email);

        setIsLoggedIn(true);
        navigate("/app");
      } else {
        setServerError(json.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setServerError("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            {serverError && (
              <div className="alert alert-danger" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("firstName")}
                  onBlur={() => handleBlur("firstName", firstName)}
                />
                {touched.firstName && errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("lastName")}
                  onBlur={() => handleBlur("lastName", lastName)}
                />
                {touched.lastName && errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email address</label>
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
                <label className="form-label">Password</label>
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

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isDisabled}
                >
                  Register
                </button>
              </div>

              <p className="mt-4 text-center">
                Already a member?{" "}
                <a href="/app/login" className="text-primary">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
