import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
