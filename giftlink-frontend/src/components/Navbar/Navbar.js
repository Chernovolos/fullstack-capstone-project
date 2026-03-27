import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();

  useEffect(() => {
    const authTokenFromSession = sessionStorage.getItem("auth-token");
    const nameFromSession = sessionStorage.getItem("name");

    if (authTokenFromSession) {
      setIsLoggedIn(true);

      if (nameFromSession) {
        setUserName(nameFromSession);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUserName]);

  const profileSection = () => {
    navigate(`/app/profile`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/app/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          GiftLink
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/app">
              Gifts
            </Link>

            <Link className="nav-link" to="/app/search">
              Search
            </Link>
          </div>
          <div className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <span className="navbar-text me-3">Welcome, {userName}!</span>
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={profileSection}
                >
                  Profile
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="row g-3">
                  <div className="col">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/app/login")}
                    >
                      Login
                    </button>{" "}
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/app/register")}
                    >
                      Register
                    </button>{" "}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
