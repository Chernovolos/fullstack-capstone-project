import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HomePage from "./components/HomePage/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import DetailsPage from "./components/DetailsPage/DetailsPage";
import SearchPage from "./components/SearchPage/SearchPage";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/product/:productId" element={<DetailsPage />} />
        <Route path="/app/search" element={<SearchPage />} />
        <Route path="/app/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
