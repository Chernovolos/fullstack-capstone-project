import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});

  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [changed, setChanged] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUserName } = useAppContext();
  const navigate = useNavigate();

  const validateName = (name) => {
    const trimmed = name.trim();

    if (!trimmed) return "Name is required";
    if (trimmed.length < 2) return "Min 2 characters";

    const regex = /^[a-zA-Zа-яА-ЯїЇєЄіІ0-9\s'_-]+$/;
    if (!regex.test(trimmed)) return "Invalid characters";

    return "";
  };

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("name");

    if (!token) {
      navigate("/app/login");
      return;
    }

    if (name && email) {
      setUserDetails({ name, email });
      setUpdatedDetails({ name });
    }
    // if (!authtoken) {
    //   navigate("/app/login");
    // } else {
    //   fetchUserProfile();
    // }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name = sessionStorage.getItem("name");

      if (name || authtoken) {
        const storedUserDetails = {
          name: name,
          email: email,
        };

        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s+/g, " ");

    setUpdatedDetails((prev) => ({
      ...prev,
      name: value,
    }));

    if (touched) {
      setError(validateName(value));
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setChanged("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdatedDetails({ name: userDetails.name }); // повертаємо старе значення
    setError("");
    setTouched(false);
  };
  // const handleInputChange = (e) => {
  //   setUpdatedDetails({
  //     ...updatedDetails,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateName(updatedDetails.name);
    setError(validationError);

    if (validationError) return;

    try {
      // const authtoken = sessionStorage.getItem("auth-token");
      // const email = sessionStorage.getItem("email");

      setLoading(true);

      const token = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!token || !email) {
        navigate("/app/login");
        return;
      }

      // const payload = { ...updatedDetails };

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Email: email,
      };

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: updatedDetails.name.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update the user details in session storage
      setUserName(updatedDetails.name);
      sessionStorage.setItem("name", updatedDetails.name);

      setUserDetails((prev) => ({
        ...prev,
        name: updatedDetails.name,
      }));

      setEditMode(false);
      setChanged("Name Changed Successfully!");

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !updatedDetails.name?.trim() || !!validateName(updatedDetails.name);

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name || ""}
              onChange={handleChange}
              onFocus={() => {
                setTouched(true);
                setError("");
              }}
            />
            {touched && error && (
              <span style={{ color: "red", fontSize: "12px" }}>{error}</span>
            )}
          </label>

          <div className="d-flex justify-content-between gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isDisabled || loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p>
            <b>Email:</b> {userDetails.email}
          </p>
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
          {changed && (
            <span
              style={{
                color: "green",
                display: "block",
                fontSize: "12px",
              }}
            >
              {changed}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
