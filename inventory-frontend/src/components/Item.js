import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Modal, Button, Form, Container, Row, Col,Offcanvas  } from "react-bootstrap";
import "./EditItem.css"; // Ensure to create/Edit CSS
import "./AddItem.css";

export const AddItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || ""; // Get apiUrl from navigation

  const getCurrentDate = () => new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  const [newItem, setNewItem] = useState({ 
    name: "", 
    price: "", 
    quantity: "", 
    start_date: getCurrentDate(), // Set default to today's date
    expiry_date: "" 
  });

  const handleChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

  const addItem = async () => {
    if (Object.values(newItem).some(value => !value)) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(apiUrl, newItem);
      navigate(-1); // Go back to inventory page
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
            <div className="form-group">
              <label>Item Name:</label>
              <input type="text" name="name" value={newItem.name} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="number" name="price" value={newItem.price} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input type="number" name="quantity" value={newItem.quantity} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input type="date" name="start_date" value={newItem.start_date} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Expiry Date:</label>
              <input type="date" name="expiry_date" value={newItem.expiry_date} onChange={handleChange} className="form-control" />
            </div>
            <button className="btn btn-success" onClick={addItem}>Add Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};



export const EditItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || ""; // Get API URL from navigation

  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedItem, setUpdatedItem] = useState({
    name: "",
    price: "",
    quantity: "",
    start_date: "",
    expiry_date: ""
  });

  // Fetch inventory data
  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, [apiUrl]);

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
  };

  // Select an item for editing
  const editItem = (item) => {
    setEditingItem(item);
    setUpdatedItem(item);
  };

  // Close modal
  const closeModal = () => {
    setEditingItem(null);
  };

  // Delete item if quantity is 0
  const deleteItem = async (itemName) => {
    try {
      await axios.delete(`${apiUrl}/${itemName}`);

      // Fetch updated inventory after deletion
      const response = await axios.get(apiUrl);
      setItems(response.data);

      setEditingItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Update item
  const updateItem = async () => {
    const newQuantity = parseInt(updatedItem.quantity, 10); // Convert quantity to number

    if (newQuantity === 0) {
      await deleteItem(editingItem.name); // Delete if quantity is 0
      return;
    }

    try {
      await axios.put(`${apiUrl}/${editingItem.name}`, updatedItem);

      // Fetch updated inventory after update
      const response = await axios.get(apiUrl);
      setItems(response.data);

      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className={`dashboard-container ${editingItem ? "blur-background" : ""}`}>
      <Sidebar />
      <div className="content">
        <h2>Edit Item</h2>

        {/* Inventory Table */}
        <table className="table table-bordered table-hover mt-4">
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
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.start_date}</td>
                <td>{item.expiry_date}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => editItem(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Form in Popup Modal */}
      {editingItem && (
        <div className="edit-modal">
          <div className="edit-card">
            <h3>Edit Item</h3>
            <div className="edit-item-form">
              <div className="form-group">
                <label>Item Name:</label>
                <input type="text" name="name" value={updatedItem.name} className="form-control" disabled />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" name="price" value={updatedItem.price} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="number" name="quantity" value={updatedItem.quantity} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input type="date" name="start_date" value={updatedItem.start_date} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Expiry Date:</label>
                <input type="date" name="expiry_date" value={updatedItem.expiry_date} onChange={handleChange} className="form-control" />
              </div>
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


 

export const DeleteItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || "";

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
      axios.get(apiUrl)
          .then(response => setItems(response.data.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))))
          .catch(error => console.error("Error fetching items:", error));
  }, [apiUrl]);

  useEffect(() => {
      if (itemName) {
          const filteredItems = items.filter(item => item.name === itemName);
          const totalQuantity = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
          setAvailableQuantity(totalQuantity);
          setPricePerUnit(filteredItems.length > 0 ? filteredItems[0].price : 0);
      } else {
          setAvailableQuantity(0);
          setPricePerUnit(0);
      }
  }, [itemName, items]);

  const deleteItem = async () => {
      if (!itemName || !quantity) {
          alert("Please enter item name and quantity.");
          return;
      }
      if (parseInt(quantity) > availableQuantity) {
        alert("Out of Stock.");
        return;
    }
      setShowSidebar(true);
  };

  return (
      <div className="dashboard-container">
          <Sidebar />
          <Container className="d-flex justify-content-center align-items-center vh-100">
              <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
                  <h3 className="text-center mb-4">Sale Item</h3>
                  
                  <Form>
                      <Form.Group className="mb-3">
                          <Row>
                              <Col xs={4} className="d-flex align-items-center">
                                  <Form.Label className="mb-0">Item Name</Form.Label>
                              </Col>
                              <Col xs={8}>
                                  <Form.Select value={itemName} onChange={(e) => setItemName(e.target.value)}>
                                      <option value="">Select an item</option>
                                      {items.map((item, index) => (
                                          <option key={index} value={item.name}>{item.name}</option>
                                      ))}
                                  </Form.Select>
                              </Col>
                          </Row>
                      </Form.Group>

                      <Form.Group className="mb-3">
                          <Row>
                              <Col xs={4} className="d-flex align-items-center">
                                  <Form.Label className="mb-0">Total Quantity</Form.Label>
                              </Col>
                              <Col xs={8}>
                                  <Form.Control type="text" value={availableQuantity} disabled />
                              </Col>
                          </Row>
                      </Form.Group>

                      <Form.Group className="mb-3">
                          <Row>
                              <Col xs={4} className="d-flex align-items-center">
                                  <Form.Label className="mb-0">Quantity To Add</Form.Label>
                              </Col>
                              <Col xs={8}>
                                  <Form.Control
                                      type="number"
                                      placeholder="Enter quantity"
                                      value={quantity}
                                      onChange={(e) => setQuantity(e.target.value)}
                                      min="1"
                                  />
                              </Col>
                          </Row>
                      </Form.Group>

                      <div className="d-flex justify-content-center">
                          <Button variant="danger" onClick={deleteItem}>
                              Add To cart
                          </Button>
                      </div>
                  </Form>
              </div>
          </Container>

          {/* Sidebar for Order Summary */}
          <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
              <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Order Summary</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                  <p><strong>Item:</strong> {itemName}</p>
                  <p><strong>Quantity:</strong> {quantity}</p>
                  <p><strong>Price per unit:</strong> ₹{pricePerUnit}</p>
                  <p><strong>Total Price:</strong> ₹{(quantity * pricePerUnit).toFixed(2)}</p>
                  <Button variant="success" className="w-100" onClick={() => { setShowSidebar(false); navigate(-1); }}>
                      Proceed to Pay
                  </Button>
              </Offcanvas.Body>
          </Offcanvas>
      </div>
  );
};


// Apply same logic for EditItem and DeleteItem





