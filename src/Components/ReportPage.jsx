import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ReportPage.css";
import Modal from "react-modal";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";
import { BASE_URL } from "../../config";

const ReportPage = () => {
  const [reportData, setReportData] = useState([]); // Store the report data
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search by name or amount
  const [searchDate, setSearchDate] = useState(""); // Search by date
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cart/all`);
        setReportData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Helper function to format the date for display
  const formatDate = (date) => {
    if (!date) return "Invalid Date";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate)) return "Invalid Date";
    return formattedDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Filter transactions based on search query and date
  const filteredData = reportData.filter(cart => {
    const matchesSearchQuery = cart.items.some(item =>
      item.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalTransactionAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
    const matchesAmountQuery = searchQuery === "" || totalTransactionAmount.toString().includes(searchQuery);

    const transactionDate = formatDate(cart.createdAt); // Format transaction date
    const matchesDateQuery = !searchDate || transactionDate === searchDate; // Compare with selected date

    return (matchesSearchQuery || matchesAmountQuery) && matchesDateQuery;
  });

  const groupItemsByTransaction = (data) => {
    const groupedData = {};
    data.forEach(cart => {
      if (!groupedData[cart.transactionId]) {
        groupedData[cart.transactionId] = { ...cart, items: [] };
      }
      groupedData[cart.transactionId].items.push(...cart.items);
    });
    return Object.values(groupedData);
  };

  const groupedReportData = groupItemsByTransaction(filteredData);
  const totalPages = Math.ceil(groupedReportData.length / rowsPerPage);
  const currentPageData = groupedReportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="report-container">
      <header>
        <h1 className="report-header"><span>Transaction</span> History</h1>
      </header>

      {/* Search Filters */}
      <div className="report-search-container">
        <input
          type="text"
          placeholder="Search by product name or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input className="report-date"
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="report-loading"><p>Loading...</p></div>
      ) : (
        <div className="report-table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Date of Transaction</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((cart) => {
                  const totalAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2);

                  return (
                    <tr key={cart.transactionId}>
                      <td>{cart.transactionId}</td>
                      <td>
                        {cart.items.map((item, index) => (
                          <span key={index}>{item.productId?.name || "No Name"}{index < cart.items.length - 1 ? ", " : ""}</span>
                        ))}
                      </td>
                      <td>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                      <td>{totalAmount}</td>
                      <td>{formatDate(cart.createdAt)}</td>
                      <td>
                        <button className="report-btn" onClick={() => setSelectedTransaction(cart) & setIsModalOpen(true)}>
                          <AiOutlineEye size={20} />
                        </button>
                        <button className="report-btn-delete" onClick={() => axios.delete(`http://localhost:5000/cart/${cart.transactionId}`)
                          .then(() => setReportData(reportData.filter(c => c.transactionId !== cart.transactionId)))}>
                          <AiFillDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6">No results found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo; Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &raquo;</button>
      </div>

      {/* Modal for Transaction Details */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal" overlayClassName="modal-overlay">
        <h2 className="report-view"><span>Transaction</span> Details</h2>
        {selectedTransaction ? (
          <div>
            <ul>
              {selectedTransaction.items.map((item, index) => (
                <li key={index}>{item.productId?.name}: {item.quantity} x ₦{item.totalAmount}</li>
              ))}
            </ul>
            <p>Total Amount: ₦{selectedTransaction.totalAmount}</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default ReportPage;
