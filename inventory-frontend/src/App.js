import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User1Page from "./pages/User1Page";
import User2Page from "./pages/User2Page";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddItem, EditItem, DeleteItem } from "./components/Item"; 

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/user1" element={<User1Page />} />
        <Route path="/user2" element={<User2Page />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-item" element={<EditItem />} />
        <Route path="/delete-item" element={<DeleteItem />} />


      </Routes>
    </Router>
  );
}

export default App;

