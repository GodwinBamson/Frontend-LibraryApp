import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AddProduct.css";
import { FaPen, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../config";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Show 8 items per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/product/products`);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { name, price: Number(price), quantity: Number(quantity) };

    try {
      if (editing) {
        // Update product
        const res = await axios.put(`${BASE_URL}/product/${editing._id}`, productData);
        if (res.data.updated) {
          setProducts((prev) =>
            prev.map((p) => (p._id === editing._id ? res.data.product : p))
          );
        }
      } else {
        // Add product
        const res = await axios.post(`${BASE_URL}/product/add`, productData);
        if (res.data.added) {
          setProducts([...products, res.data.product]);
        }
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/product/${id}`);
      if (res.data.deleted) {
        setProducts(products.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditing = (product) => {
    setEditing(product);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setQuantity("");
    setEditing(null);
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  return (
    <div className="add-container">
      <h1 className="add-product-name"> <span>Product </span>Tracker</h1>

      {/* Search input */}
      <div className="add-search-container">
        <input
          type="text"
          placeholder="Search products by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="add-grid-container">
        {/* Product Table */}
        <div className="add-table-container">
          <table className="add-table-form">
            <thead className="add-product-head">
              <tr className="add-product-tab">
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="add-product-body">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr className="add-column" key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td className="add-product-table">
                      <button onClick={() => startEditing(product)}>
                        <FaPen size={15} />
                      </button>
                      <button className="add-product-red" onClick={() => deleteProduct(product._id)}>
                        <FaTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Product Form */}
        <div className="add-form-container">
          <form className="add-product-desrip" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button className="add-product-update" type="submit" disabled={!name || !price || !quantity}>
              {editing ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="add-product-next"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`add-product-none ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="add-product-next"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
