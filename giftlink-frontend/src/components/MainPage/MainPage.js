import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { urlConfig } from "../../config";

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch all gifts
    const fetchGifts = async () => {
      try {
        let url = `${urlConfig.backendUrl}/api/gifts`;
        const response = await fetch(url);
        if (!response.ok) {
          //something went wrong
          throw new Error(`HTTP error; ${response.status}`);
        }
        const data = await response.json();
        setGifts(data);
      } catch (error) {
        console.log("Fetch error: " + error.message);
      }
    };
    fetchGifts();
  }, []);

  // Task 2: Navigate to details page
  const goToDetailsPage = (productId) => {
    console.log("Product ID type:", typeof productId, "value:", productId);
    navigate(`/app/product/${productId}`);
  };

  // Task 3: Format timestamp
  const formatDate = (timestamp) => {
    // Write your code below this line
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getConditionClass = (condition) => {
    if (condition === "New") return "text-success";
    if (condition === "Like New") return "text-warning";
    return "text-danger";
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        {gifts.map((gift) => (
          <div key={gift.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card product-card shadow-sm rounded-3 border-0 h-100">
              <div className="image-placeholder position-relative overflow-hidden">
                {gift.image ? (
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="card-img-top img-fluid"
                  />
                ) : (
                  <div className="no-image-available d-flex align-items-center justify-content-center">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate" title={gift.name}>
                  {gift.name}
                </h5>

                <p
                  className={`card-text mb-2 ${getConditionClass(gift.condition)}`}
                >
                  {gift.condition}
                </p>

                <p className="card-text text-muted small mb-3 date-added">
                  {formatDate(gift.date_added)}
                </p>

                <button
                  onClick={() => goToDetailsPage(gift.id)}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
