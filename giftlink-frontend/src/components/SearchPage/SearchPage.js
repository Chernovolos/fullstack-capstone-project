import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchPage.css";
import { urlConfig } from "../../config";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState(6);
  const [searchResults, setSearchResults] = useState([]);
  const [categorySelect, setCategorySelect] = useState("");
  const [conditionSelect, setConditionSelect] = useState("");
  //Task 1: Define state variables for the search query, age range, and search results.
  const categories = ["Living", "Bedroom", "Bathroom", "Kitchen", "Office"];
  const conditions = ["New", "Like New", "Older"];

  console.log("searchResults: ", searchResults);
  useEffect(() => {
    // fetch all products
    const fetchProducts = async () => {
      try {
        let url = `${urlConfig.backendUrl}/api/gifts`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          //something went wrong
          throw new Error(`HTTP error; ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.log("Fetch error: " + error.message);
      }
    };

    fetchProducts();
  }, []);

  // Task 2. Fetch search results from the API based on user inputs.

  const handleSearch = async () => {
    console.log("Search query: ", searchQuery);
    const baseUrl = `${urlConfig.backendUrl}/api/search?`;
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: categorySelect,
      condition: conditionSelect,
    }).toString();
    console.log("Query params: ", queryParams);

    try {
      const response = await fetch(`${baseUrl}${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error; ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
      console.log("Search response: ", data);
    } catch (error) {
      console.error("Search error: ", error);
    }
  };

  const navigate = useNavigate();

  const goToDetailsPage = (productId) => {
    // Task 6. Enable navigation to the details page of a selected gift.
    // navigate(`/app/gifts/${productId}`);
    navigate(`/app/product/${productId}`);
  };

  const getConditionClass = (condition) => {
    return condition === "New"
      ? "list-group-item-success"
      : "list-group-item-warning";
  };

  return (
    <div className="container mt-5">
      <div className="row d-flex">
        <div className="col-md-12">
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>
            <div className="d-flex flex-column">
              <label htmlFor="categorySelect">Category</label>
              <select
                id="categorySelect"
                className="form-control my-1"
                value={categorySelect}
                onChange={(e) => setCategorySelect(e.target.value)}
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="conditionSelect">Condition</label>
              <select
                id="conditionSelect"
                className="form-control my-1"
                value={conditionSelect}
                onChange={(e) => setConditionSelect(e.target.value)}
              >
                <option value="">All</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>

              <label htmlFor="ageRange">Less than {ageRange} years</label>
              <input
                type="range"
                className="form-control-range"
                id="ageRange"
                min="1"
                max="10"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              />
            </div>
          </div>
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              id="search"
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="row d-flex justify-content-start">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
              <div className="card product-card card product-card shadow-sm rounded-3 border-0 h-100">
                <div className="image-placeholder position-relative overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top product-image img-fluid"
                    />
                  )}
                </div>
                <div className="card-body product-card-body">
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  <p
                    className={`card-text product-condition ${getConditionClass(product.condition)}`}
                  >
                    {product.condition}
                  </p>

                  <p className="card-text product-condition">
                    <small class="text-body-secondary">
                      {" "}
                      {product.description.slice(0, 100)}...
                    </small>
                  </p>
                  <button
                    className="btn btn-primary mt-auto view-details-btn"
                    onClick={() => goToDetailsPage(product.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-md-12">
            <div className="search-results mt-4">
              <div className="alert alert-info" role="alert">
                No products found. Please revise your filters.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
