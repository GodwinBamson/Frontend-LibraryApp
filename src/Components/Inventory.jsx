import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../css/Inventory.css";
import { BASE_URL } from "../../config";

const Inventory = () => {
  const [searchedQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/product/products`
        );
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = useMemo(
    () =>
      products.filter(
        (item) =>
          item.name.toLowerCase().includes(searchedQuery.toLowerCase()) &&
          (value
            ? item.name.toLowerCase().startsWith(value.toLowerCase())
            : true)
      ),
    [searchedQuery, value, products]
  );

  const calculateTotal = useCallback((price, qty) => price * qty, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.name);
    setValue("");
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQty(newQuantity);
    } else {
      setQty(1);
    }
  };

  const addProductToCart = () => {
    if (!selectedProduct || qty <= 0 || qty > selectedProduct.quantity) {
      alert("Invalid quantity. Check available stock.");
      return;
    }

    const existingProduct = cartItems.find(
      (item) => item._id === selectedProduct._id
    );
    if (existingProduct) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === selectedProduct._id
            ? {
                ...item,
                qty: item.qty + qty,
                sum: calculateTotal(item.price, item.qty + qty),
              }
            : item
        )
      );
    } else {
      const sum = calculateTotal(selectedProduct.price, qty);
      setCartItems((prevItems) => [
        ...prevItems,
        {
          _id: selectedProduct._id,
          name: selectedProduct.name,
          qty,
          price: selectedProduct.price,
          sum,
        },
      ]);
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === selectedProduct._id
          ? { ...product, quantity: product.quantity - qty }
          : product
      )
    );

    setSelectedProduct(null);
    setQty(1);
    setSearchQuery("");
  };

  const removeProductFromCart = async (id) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item._id === id);
      if (!itemToRemove) return prevItems;

      // Restore product quantity in the inventory
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id
            ? { ...product, quantity: product.quantity + itemToRemove.qty }
            : product
        )
      );

      // Remove only the selected item from the cart
      const updatedCart = prevItems.filter((item) => item._id !== id);

      return updatedCart;
    });

    // ✅ Fetch updated products from the backend instead of reloading the page
    try {
      const { data } = await axios.get(
        `${BASE_URL}/product/products`
      );
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching updated products:", error);
    }
  };

  useEffect(() => {
    setTotal(cartItems.reduce((accum, item) => accum + item.sum, 0));
  }, [cartItems]);

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchQuery("");
    setQty(1);
    setValue("");
  };

  const printReceipt = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const newWindow = window.open("", "_blank");
  
    newWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            .add-inventory-name { text-align: center; }
            .inventory-print-id { text-align: center; }
            h2, h3 { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
  
    newWindow.document.close();
  };
 
  
  const clearCart = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/cart/complete`, {
        cart: cartItems.map((item) => ({
          transactionId: "",
          productId: item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          totalAmount: item.sum,
        })),
      });
  
      if (response.status === 200) {
        alert("Your order has been completed!");
        
        // ✅ Set transaction ID first
        setTransactionId(response.data.transactionId);
      }
    } catch (error) {
      console.error("Error completing the order:", error);
      alert("There was an error completing your order.");
    }
  };
  

  const updateCartItemQuantity = (id, newQty) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id !== id) return item; // Skip items that are not being updated
  
        const product = products.find((p) => p._id === id);
        if (!product) return item;
  
        const maxStock = product.quantity + item.qty; // Total available stock including what's already in the cart
  
        if (newQty < 1) return item; // Prevents quantity from going below 1
        if (newQty > maxStock) return item; // Prevents exceeding available stock
  
        // Update inventory dynamically
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === id
              ? { ...p, quantity: maxStock - newQty } // Adjust inventory stock dynamically
              : p
          )
        );
  
        return { ...item, qty: newQty, sum: calculateTotal(item.price, newQty) };
      });
    });
  };
  
  useEffect(() => {
    if (transactionId) {
      setTimeout(() => {
        printReceipt();
        
        // ✅ Reset cart and total after printing
        setCartItems([]);
        setTotal(0);
      }, 500);
    }
  }, [transactionId]); // 👈 This runs only when `transactionId` updates
  

  return (
    <div className="inventory-container">
      <header>
        <h1 className="add-inventory-name">
          <span>Inventory Manag</span>ement System
        </h1>
      </header>

      <h3>Add Products</h3>
      <div className="inventory-add-div">
        <table className="inventory-responsive-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Available Qty</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="inventory-cal-input"
                  type="text"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setValue(e.target.value);
                  }}
                  value={searchedQuery}
                  placeholder="Search Products"
                />
                {value && !selectedProduct && filteredItems.length > 0 && (
                  <ul>
                    {filteredItems.slice(0, 5).map((item) => (
                      <li
                        key={item._id}
                        onClick={() => handleProductClick(item)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </td>

              <td>
                <input
                  className="inventory-cal-input"
                  type="text"
                  value={selectedProduct ? selectedProduct.price : ""}
                  readOnly
                />
              </td>

              <td>
                <input
                  className="inventory-cal-input"
                  type="text"
                  value={selectedProduct ? selectedProduct.quantity : ""}
                  readOnly
                />
              </td>

              <td>
                <input
                  className="inventory-cal-input"
                  type="number"
                  value={qty}
                  onChange={handleQuantityChange}
                  min="1"
                  max={selectedProduct ? selectedProduct.quantity : ""}
                />
              </td>

              <td>
                <input
                  className="inventory-cal-input"
                  type="text"
                  value={calculateTotal(selectedProduct?.price || 0, qty)}
                  readOnly
                />
              </td>

              <td className="inventory-add-parent">
                <button
                  className="quantity-btn"
                  type="button"
                  onClick={addProductToCart}
                  disabled={
                    !selectedProduct ||
                    qty <= 0 ||
                    qty > (selectedProduct?.quantity || 0)
                  }
                >
                  Add
                </button>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={handleClearSelection}
                >
                  Clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Cart</h3>
      <table className="inventory-responsive-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((row) => (
            <tr key={row._id}>
              <td>{row.name}</td>
              <td>{row.price}</td>
              <td className="quantity-name">
                <div className="inventory-quantity-container">
                  <button
                    type="button"
                    onClick={() => updateCartItemQuantity(row._id, row.qty - 1)}
                    className="quantity-btn"
                    disabled={row.qty <= 1}
                  >
                    -
                  </button>
                  <input
                    className="input-inventory"
                    type="number"
                    value={row.qty}
                    onChange={(e) =>
                      updateCartItemQuantity(
                        row._id,
                        parseInt(e.target.value, 10)
                      )
                    }
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => updateCartItemQuantity(row._id, row.qty + 1)}
                    className="quantity-btn"
                    disabled={
                      row.qty >=
                      (products.find((p) => p._id === row._id)?.quantity || 0)
                    }
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{row.sum}</td>
              <td className="icon-name">
                <button
                  className="inventory-remove-btn"
                  onClick={() => removeProductFromCart(row._id)}
                >
                  <FaTrash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="parent">
        <input className="total-input" type="text" value={total} disabled />
        <button className="quantity-btn complete" onClick={clearCart}>
          Complete
        </button>
      </div>
      <div id="print-section" style={{ display: "none" }}>
        <h2 className="add-inventory-name">
          <span>Order</span> Summary
        </h2>
        <table>
          <h2 className="add-inventory-name">
            <span>Receipt For</span> Transaction
          </h2>
          <thead>
            <tr className="inventory-print">
              <th>Item Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((row) => (
              <tr key={row._id}>
                <td className="inventory-print-id">{row.name}</td>
                <td className="inventory-print-id">{row.price}</td>
                <td className="inventory-print-id">{row.qty}</td>
                <td className="inventory-print-id">{row.sum}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: {total}</h3>
        <p>Transaction ID: {transactionId}</p>
      </div>
    </div>
  );
};

export default Inventory;
