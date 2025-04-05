import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./Inventory.css";
import { Card, Container, Row, Col } from "react-bootstrap";

const Inventory = ({ apiUrl }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  // Fetch inventory data
  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        const sortedItems = response.data.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
        setItems(sortedItems);
        // Calculate total value
        const value = sortedItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
        setTotalValue(value);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, [apiUrl]);

  return (
    <div className="dashboard-container">
  <Sidebar />
  <div className="content">
    <h2>Inventory Dashboard</h2>

    {/* Navigation Buttons */}
    <div className="button-group">
      <button className="btn btn-success" onClick={() => navigate("/add-item", { state: { apiUrl } })}>
        Add Inventory
      </button>
      <button className="btn btn-warning" onClick={() => navigate("/edit-item", { state: { apiUrl } })}>
        Edit Inventory
      </button>
      <button className="btn btn-danger" onClick={() => navigate("/delete-item", { state: { apiUrl } })}>
        Cart Inventory
      </button>
    </div>

    {/* Bill Summary Section */}
    <div className="bill-summary">
      <h3>Bill Summary</h3>
      <div className="card-container">
        <div className="card">
          <h4>Total Items</h4>
          <p>{items.length}</p>
        </div>
        <div className="card">
          <h4>Total Value</h4>
          <p>₹{totalValue.toFixed(2)}</p>
        </div>
      </div>
    </div>

    {/* ✅ Move Inventory Title and Grid Inside .content */}
    <h3 className="inventory-title">Inventory Items</h3>
<div className="inventory-table-container">
  {items.length > 0 ? (
    <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Price (₹)</th>
          <th>Quantity</th>
          <th>Expiry Date</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>₹{item.price}</td>
            <td>{item.quantity} pcs</td>
            <td>{new Date(item.expiry_date).toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="no-items">No items in inventory.</p>
  )}
</div>
  </div>
</div>

  );
};

export default Inventory;








