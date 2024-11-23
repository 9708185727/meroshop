import React, { useState, useEffect } from "react";
import { Layout, LegacyCard, TextContainer, Text } from "@shopify/polaris";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export function OrderGraphs() {
  // States for chart data
  const [orderData, setOrderData] = useState({
    labels: [],
    datasets: [
      {
        label: "Order Details",
        data: [],
        backgroundColor: ["#008170", "#000000", "#8e8e8e", "#81BF37"],
      },
    ],
  });

  // States for the top 5 products and top 5 customers
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  // Fetch top products and customers data from backend
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("/api/products/top-sold");
        const data = await response.json();
        setTopProducts(data); // Set top products
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };

    const fetchTopCustomers = async () => {
      try {
        const response = await fetch("/api/customers/top-value");
        const text = await response.text();  // Read the response as plain text
        console.log("Raw response:", text);  // Log raw response
    
        // Only parse JSON if the response is valid
        if (response.ok) {
          const data = JSON.parse(text);  // Parse it manually
          setTopCustomers(data);
          console.log(data)
        } else {
          console.error("Error fetching top customers:", text);
        }
      } catch (error) {
        console.error("Error fetching top customers:", error);
      }
    };
    

    fetchTopProducts();
    fetchTopCustomers();
  }, []);

  // Chart data for order details (can replace with your actual data)
  useEffect(() => {
    setOrderData({
      labels: ["January", "February", "March", "April"], // Example labels
      datasets: [
        {
          label: "Total Orders",
          data: [120, 150, 100, 180], // Example order data
          backgroundColor: "#008170",
        },
        {
          label: "Completed Orders",
          data: [100, 120, 80, 160], // Example completed orders data
          backgroundColor: "#81BF37",
        },
        {
          label: "Remaining Orders",
          data: [20, 30, 20, 20], // Example remaining orders data
          backgroundColor: "#8e8e8e",
        },
      ],
    });
  }, []);

  return (
    <div>
      <Layout>
        {/* Order Details Graphs */}
        <Layout.Section oneHalf>
          <LegacyCard title="Order Graphs" sectioned>
            <Line data={orderData} options={{ responsive: true, maintainAspectRatio: false }} />
          </LegacyCard>
        </Layout.Section>

        {/* Display Top 5 Products */}
        <Layout.Section oneHalf>
          <LegacyCard title="Top 5 Products Sold" sectioned>
            <TextContainer>
              {topProducts.length === 0 ? (
                <p>Loading top products...</p>
              ) : (
                topProducts.map((product, index) => (
                  <Text key={product.id}>
                    {index + 1}. {product.name} - Sold: {product.quantitySold}
                  </Text>
                ))
              )}
            </TextContainer>
          </LegacyCard>
        </Layout.Section>

        {/* Display Top 5 Customers */}
        <Layout.Section oneHalf>
          <LegacyCard title="Top 5 Most Valuable Customers" sectioned>
            <TextContainer>
              {topCustomers.length === 0 ? (
                <p>Loading top customers...</p>
              ) : (
                topCustomers.map((customer, index) => (
                  <Text key={customer.id}>
                    {index + 1}. {customer.name} - Total Spent: ${customer.totalPurchaseValue}
                  </Text>
                ))
              )}
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </div>
  );
}
