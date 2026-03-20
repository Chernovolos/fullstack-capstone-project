import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { urlConfig } from "../../config";
import "./DetailsPage.css";

function DetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticationToken = sessionStorage.getItem("auth-token");
    if (!authenticationToken) {
      // Task 1: Check for authentication and redirect
      navigate("/app/login");
      return;
    }

    // get the gift to be rendered on the details page
    const fetchGift = async () => {
      try {
        // Task 2: Fetch gift details
        const response = await fetch(
          `${urlConfig.backendUrl}/api/gifts/${productId}`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            setError("Gift not found");
          } else {
            throw new Error("Network response was not ok");
          }
        }
        const data = await response.json();
        setGift(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();

    // Task 3: Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleBackClick = () => {
    // Task 4: Handle back click
    navigate(-1);
  };

  //The comments have been hardcoded for this project.
  const comments = [
    {
      author: "John Doe",
      comment: "I would like this!",
    },
    {
      author: "Jane Smith",
      comment: "Just DMed you.",
    },
    {
      author: "Alice Johnson",
      comment: "I will take it if it's still available.",
    },
    {
      author: "Mike Brown",
      comment: "This is a good one!",
    },
    {
      author: "Sarah Wilson",
      comment:
        "My family can use one. DM me if it is still available. Thank you!",
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gift) return <div>Gift not found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={handleBackClick}>
        Back
      </button>

      <div className="card mb-3">
        {gift.image ? (
          <img
            src={gift.image}
            alt={gift.name}
            className="product-image-large card-img-top"
          />
        ) : (
          <div className="no-image-available-large">No Image Available</div>
        )}
        <div className="card-body">
          <h5 className="card-title">{gift.name}</h5>
          <p className="card-text">
            <strong>Condition: </strong>
            {gift.condition}
          </p>
          <p className="card-text">
            <strong>Date Added: </strong>
            {new Date(gift.date_added * 1000).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Age (Years): </strong>
            {gift.age_years}
          </p>
          <p className="card-text">
            <strong>Description: </strong>
            {gift.description}
          </p>
          <p className="card-text">
            <small className="text-body-secondary">
              Last updated 3 mins ago
            </small>
          </p>
        </div>
      </div>

      <div className="comments-section mt-4">
        <h3 className="mb-3">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <p className="comment-author">
                <strong>{comment.author}:</strong>
              </p>
              <p className="comment-text">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailsPage;
