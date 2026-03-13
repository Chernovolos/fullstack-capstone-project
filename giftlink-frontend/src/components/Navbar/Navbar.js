import React from "react";

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          GiftLink
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-link" href="/home.html">
              Home
            </a>
            <a class="nav-link" href="/app">
              Gifts
            </a>
          </div>
        </div>
      </div>
    </nav>
    // <nav className="navbar navbar-expand-lg navbar-light bg-light">
    //   <a className="navbar-brand" href="/">
    //     GiftLink
    //   </a>

    //   <div className="collapse navbar-collapse" id="navbarNav">
    //     <ul className="navbar-nav">
    //       {/* Task 1: Add links to Home and Gifts below*/}
    //       <li className="nav-item">
    //         <a className="nav-link" href="/home.html">
    //           Home
    //         </a>
    //       </li>
    //       <li className="nav-item">
    //         <a className="nav-link" href="/app">
    //           Gifts
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
}
