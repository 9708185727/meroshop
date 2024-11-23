import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export function TopBar() {
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    let fetchData = async () => {
      try {
        let request = await fetch("/api/store/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check if the response is OK (status 200)
        if (!request.ok) {
          throw new Error(`Error: ${request.statusText}`);
        }

        const textResponse = await request.text(); // Read the response as text
        console.log("Raw response:", textResponse);

        // Manually parse the JSON response if it's not empty
        if (textResponse) {
          let response = JSON.parse(textResponse);
          console.log("Parsed response:", response);

          // Assuming shopName is directly in the response and not nested inside storeInfo
          setStoreInfo(response); // Set the entire response if it contains the shopName
        } else {
          console.error("Empty response from server");
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="topbar-section">
        <div className="logo-block">
          <img className="logo" src="../assets/logo.png" alt="alt" />
        
          {storeInfo ? (
            <div className="store-name">
              <h2>Welcome to {storeInfo.shopName}</h2> {/* Accessing shopName */}
            </div>
          ) : (
            <p>Loading store info...</p> // Loading text if store info is not fetched yet
          )}

          <NavLink to="/">Sales</NavLink>
          <NavLink to="/products">Products</NavLink>
        </div>
      </div>
    </div>
  );
}
