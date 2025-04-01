import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import "./EditItem.css"; // Ensure to create/Edit CSS
import "./AddItem.css";

export const AddItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = location.state?.apiUrl || ""; // Get apiUrl from navigation

  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "", start_date: "", expiry_date: "" });

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
            <input type="text" name="name" placeholder="Item Name" value={newItem.name} onChange={handleChange} className="form-control" />
            <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleChange} className="form-control" />
            <input type="number" name="quantity" placeholder="Quantity" value={newItem.quantity} onChange={handleChange} className="form-control" />
            <input type="date" name="start_date" placeholder="Start Date" value={newItem.start_date} onChange={handleChange} className="form-control" />
            <input type="date" name="expiry_date" placeholder="Expiry Date" value={newItem.expiry_date} onChange={handleChange} className="form-control" />
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

  // Update item
  const updateItem = async () => {
    try {
      await axios.put(`${apiUrl}/${editingItem.name}`, updatedItem);
      setEditingItem(null);
      navigate(-1); // Go back to inventory page
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
                <td>${item.price}</td>
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
            <input type="text" name="name" value={updatedItem.name} className="form-control" disabled />
            <input type="number" name="price" value={updatedItem.price} onChange={handleChange} className="form-control" />
            <input type="number" name="quantity" value={updatedItem.quantity} onChange={handleChange} className="form-control" />
            <input type="date" name="start_date" value={updatedItem.start_date} onChange={handleChange} className="form-control" />
            <input type="date" name="expiry_date" value={updatedItem.expiry_date} onChange={handleChange} className="form-control" />
            
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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => setItems(response.data.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))))
            .catch(error => console.error("Error fetching items:", error));
    }, [apiUrl]);

    const deleteItem = async () => {
        if (!itemName || !quantity) {
            alert("Please enter item name and quantity.");
            return;
        }

        const sortedItems = [...items]
            .filter(item => item.name === itemName)
            .sort((a, b) => new Date(b.expiry_date) - new Date(a.expiry_date));

        let remainingQuantity = parseInt(quantity);
        let updatedItems = [...items];

        try {
            for (let item of sortedItems) {
                if (remainingQuantity <= 0) break;

                if (item.quantity > remainingQuantity) {
                    await axios.put(`${apiUrl}/${item.name}`, { quantity: item.quantity - remainingQuantity });
                    updatedItems = updatedItems.map(i =>
                        i.name === item.name && i.expiry_date === item.expiry_date
                            ? { ...i, quantity: i.quantity - remainingQuantity }
                            : i);
                    remainingQuantity = 0;
                } else {
                    await axios.delete(`${apiUrl}/${item.name}`);
                    updatedItems = updatedItems.filter(i => !(i.name === item.name && i.expiry_date === item.expiry_date));
                    remainingQuantity -= item.quantity;
                }
            }
            setItems(updatedItems);
            setShowModal(false);
            navigate(-1);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
                    <h3 className="text-center mb-4">Delete Item</h3>
                    
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
                                    <Form.Label className="mb-0">Quantity</Form.Label>
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
                            <Button variant="danger" onClick={() => setShowModal(true)}>
                                Delete
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{quantity}</strong> units of <strong>{itemName}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={deleteItem}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


// Apply same logic for EditItem and DeleteItem





