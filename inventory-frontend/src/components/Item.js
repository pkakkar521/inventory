import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Modal, Button, Form, Container, Row, Col, Offcanvas ,Card } from "react-bootstrap";
import "./EditItem.css";
import "./AddItem.css";
import './DeleteItem.css'; // Make sure to import the CSS file

/** ----------------------------
 * AddItem Component
 * Allows the user to add a new inventory item
 ---------------------------- */
 export const AddItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || ""; // Get API URL passed through navigation

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // Local state for new item form
  const [newItem, setNewItem] = useState({ 
    name: "", 
    batch_number: "",   // ✅ Added batch_number
    price: "", 
    quantity: "", 
    start_date: getCurrentDate(), 
    expiry_date: "" 
  });

  // Update form state on input change
  const handleChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

  // Submit item to API
  const addItem = async () => {
    if (Object.values(newItem).some(value => !value)) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(apiUrl, newItem);
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="dashboard-container add-item-container">
      <Sidebar />
      <div className="content">
        <div className="card add-item-card">
          <h2>Add Item</h2>
          <div className="add-item-form">
            {/* Manually render each field to control order */}
            {/* Item Name */}
            <div className="form-group">
              <label>Item Name:</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* ✅ Batch Number Field */}
            <div className="form-group">
              <label>Batch Number:</label>
              <input
                type="text"
                name="batch_number"
                value={newItem.batch_number}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={newItem.start_date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Expiry Date */}
            <div className="form-group">
              <label>Expiry Date:</label>
              <input
                type="date"
                name="expiry_date"
                value={newItem.expiry_date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button className="btn btn-success" onClick={addItem}>Add Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};


/** ----------------------------
 * EditItem Component
 * Allows user to update or delete items
 ---------------------------- */
 export const EditItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || "";

  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedItem, setUpdatedItem] = useState({
    name: "",
    price: "",
    quantity: "",
    start_date: "",
    expiry_date: ""
  });

  // Fetch all items on component mount
  useEffect(() => {
    axios.get(apiUrl)
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items:", err));
  }, [apiUrl]);

  // Update form values when editing
  const handleChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  // Open edit modal
  const editItem = (item) => {
    setEditingItem(item);
    setUpdatedItem(item);
  };

  // Close modal
  const closeModal = () => setEditingItem(null);

  // Delete item by name
  const deleteItem = async (itemName) => {
    try {
      await axios.delete(`${apiUrl}/${itemName}`);
      const res = await axios.get(apiUrl); // Refresh list
      setItems(res.data);
      setEditingItem(null);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Update the item
  const updateItem = async () => {
    try {
      await axios.put(`${apiUrl}/${editingItem.name}`, updatedItem);
      const res = await axios.get(apiUrl); // Refresh
      setItems(res.data);
      setEditingItem(null);
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  return (
    <div className={`dashboard-container ${editingItem ? "blur-background" : ""}`}>
      <Sidebar />
      <div className="content">
        <h2>Edit Item</h2>

        {/* Search bar in top right */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            style={{ width: "250px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table displaying current inventory */}
        <table className="table table-bordered table-hover mt-2">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Start Date</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...items]
              .sort((a, b) => {
                const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
                const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
                return bMatch - aMatch; // matched items float to top
              })
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.start_date}</td>
                  <td>{item.expiry_date}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-primary" onClick={() => editItem(item)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteItem(item.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing an item */}
      {editingItem && (
        <div className="edit-modal">
          <div className="edit-card">
            <h3>Edit Item</h3>
            <div className="edit-item-form">
              {["name", "price", "quantity", "start_date", "expiry_date"].map((field, i) => (
                <div className="form-group" key={i}>
                  <label>{field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}:</label>
                  <input
                    type={field.includes("date") ? "date" : (field === "price" || field === "quantity") ? "number" : "text"}
                    name={field}
                    value={updatedItem[field]}
                    onChange={handleChange}
                    className="form-control"
                    disabled={field === "name"} // Name is not editable
                  />
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="btn btn-warning" onClick={updateItem}>Update Item</button>
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** ----------------------------
 * DeleteItem Component
 * Handles sales (deleting quantity of items)
 ---------------------------- */

 export const DeleteItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || "";

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [batchInfo, setBatchInfo] = useState({ batchNumber: "", expiryDate: "" });

  const [totalPayable, setTotalPayable] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    axios.get(apiUrl)
      .then((res) => {
        setItems(res.data.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)));
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, [apiUrl]);

  useEffect(() => {
    if (itemName && batchNumber) {
      const matched = items.filter(
        (item) =>
          item.name === itemName &&
          item.batch_number === batchNumber &&
          item.quantity >= 1
      );

      const totalQty = matched.reduce((sum, item) => sum + item.quantity, 0);
      setAvailableQuantity(totalQty);
      setPricePerUnit(matched.length > 0 ? matched[0].price : 0);

      if (matched.length > 0) {
        setBatchInfo({
          batchNumber: matched[0].batch_number || "N/A",
          expiryDate: matched[0].expiry_date || "N/A",
        });
      }
    } else {
      setAvailableQuantity(0);
      setPricePerUnit(0);
      setBatchInfo({ batchNumber: "", expiryDate: "" });
    }
  }, [itemName, batchNumber, items]);

  const handleItemInputChange = (e) => {
    const value = e.target.value;
    setItemName(value);

    const filtered = items
      .filter(
        (item) =>
          item.name.toLowerCase().startsWith(value.toLowerCase()) &&
          item.quantity >= 1
      )
      .map((item) => ({
        name: item.name,
        batchNumber: item.batch_number || "N/A",
        expiryDate: item.expiry_date || "N/A",
      }));

    setSuggestions(filtered);
  };

  const handleSuggestionClick = (name, batch) => {
    setItemName(name);
    setBatchNumber(batch);
    setSuggestions([]);
  };

  const handleAddToCart = () => {
    if (!itemName || !batchNumber || !quantity) {
      alert("Please enter item name, batch number, and quantity.");
      return;
    }

    if (parseInt(quantity) > availableQuantity) {
      alert("Out of Stock.");
      return;
    }

    const matchedItem = items.find(
      (item) =>
        item.name === itemName &&
        item.batch_number === batchNumber &&
        item.quantity >= 1
    );

    const newItem = {
      name: itemName,
      batchNumber: batchNumber,
      quantity: parseInt(quantity),
      pricePerUnit: pricePerUnit,
      total: parseInt(quantity) * pricePerUnit,
      expiryDate: matchedItem ? matchedItem.expiry_date : "N/A",
    };

    setCartItems([...cartItems, newItem]);
    setItemName("");
    setBatchNumber("");
    setQuantity("");
  };

  const handleProceed = () => {
    alert("Proceeding to payment...");
    navigate(-1);
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);
    setTotalPayable(total);

    let discountPercent = 0;
    if (total > 2000) discountPercent = 20;
    else if (total > 1000) discountPercent = 15;
    else if (total > 500) discountPercent = 10;
    else if (total > 0) discountPercent = 5;

    const discountAmount = (total * discountPercent) / 100;
    setDiscount(discountAmount);
    setDiscountPercentage(discountPercent);
    setDiscountedTotal(total - discountAmount);
  }, [cartItems]);

  const increaseDiscount = () => {
    if (discountPercentage < 100) {
      const newDiscount = discountPercentage + 5;
      setDiscountPercentage(newDiscount);
      updateDiscountedTotal(newDiscount);
    }
  };

  const decreaseDiscount = () => {
    if (discountPercentage > 0) {
      const newDiscount = discountPercentage - 5;
      setDiscountPercentage(newDiscount);
      updateDiscountedTotal(newDiscount);
    }
  };

  const updateDiscountedTotal = (newDiscountPercentage) => {
    const total = totalPayable;
    const discountAmount = (total * newDiscountPercentage) / 100;
    setDiscount(discountAmount);
    setDiscountedTotal(total - discountAmount);
  };

  return (
    <div className="dashboard-container delete-item-page">
      <Sidebar />
      <div className="content">
        <h2 className="page-title">SALE ITEM</h2>

        {/* Item Search */}
        <div className="top-search-row">
          <label className="search-label">Item Name</label>
          <div className="search-input-wrapper">
            <Form.Control
              type="text"
              placeholder="Start typing item name..."
              value={itemName}
              onChange={handleItemInputChange}
            />
            {suggestions.length > 0 && (
              <div className="suggestion-box">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion.name, suggestion.batchNumber)}
                  >
                    {suggestion.name} ({suggestion.batchNumber})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Batch Info Section */}
        <div className="form-flex-section">
          <div className="column-box">
            <Form.Group className="mb-3">
              <Form.Label>Batch Number</Form.Label>
              <Form.Control type="text" value={batchNumber} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control type="text" value={availableQuantity} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity To Add</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </Form.Group>

            <Button variant="danger" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Cart Section */}
        {cartItems.length > 0 && (
          <div className="cart-section mt-4">
            <h4>Cart Items</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Batch Number</th>
                  <th>Expiry Date</th>
                  <th>Quantity</th>
                  <th>Price Per Unit</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.batchNumber}</td>
                    <td>{new Date(item.expiryDate).toDateString()}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.pricePerUnit}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
  <h5>Subtotal: ₹{totalPayable.toFixed(2)}</h5>

  <div className="discount-row">
    <span className="label">Discount ({discountPercentage}%)</span>
    <div className="discount-control-inline">
      <button onClick={decreaseDiscount} className="btn btn-sm">-</button>
      <span className="discount-text">{discountPercentage}%</span>
      <button onClick={increaseDiscount} className="btn btn-sm">+</button>
    </div>
    <span className="amount">-₹{discount.toFixed(2)}</span>
  </div>

  <h4 className="text-danger mt-3">Total Payable: ₹{discountedTotal.toFixed(2)}</h4>
</div>

            <Button variant="success" className="mt-3" onClick={handleProceed}>
              Proceed to Pay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Apply same logic for EditItem and DeleteItem





