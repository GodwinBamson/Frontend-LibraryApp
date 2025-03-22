import React, { useEffect, useState } from "react";
import "../css/Dashboard.css"; 
import axios from "axios";
import CircularProgress from "./CircularProgress"; 
import TinyBarChart from "./TinyBarChart"; 
import { BASE_URL } from "../../config";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [productStats, setProductStats] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/dashboard`)
      .then((res) => {
        if (res.data) {
          setTotalUsers(res.data.totalUsers);
          setTotalAdmins(res.data.totalAdmins);
          setTotalStaff(res.data.totalStaff);
          setTotalProducts(res.data.totalProducts);
          setTotalSales(res.data.totalSales);
        }
      })
      .catch((err) => console.error("Error fetching dashboard data:", err));

    // Fetch product statistics
    axios.get(`${BASE_URL}/product/products`)
      .then((res) => {
        if (res.data.products) {
          setProductStats(res.data.products);
        }
      })
      .catch((err) => console.error("Error fetching product statistics:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard-h1"><span>Dashboard</span> Overview</h1>

      <div className="dashboard-container">
        <div className="dashboard-box first">
          <h2>Daily Sales</h2>
          <CircularProgress progress={totalSales} size={130} color=" #4caf50">
            <span className="dashboard-sale">₦{totalSales}</span> 
          </CircularProgress>
        </div>

        <div className="dashboard-box">
          <h2>Total Products</h2>
          <CircularProgress progress={totalProducts} size={130} color=" #8800ff" />
        </div>

        <div className="dashboard-box">
          <h2>Total Staff</h2>
          <CircularProgress progress={totalStaff} size={130} color=" #e91e63" />
        </div>

        <div className="dashboard-box">
          <h2>Total Admins</h2>
          <CircularProgress progress={totalAdmins} size={130} color=" #ff9800" />
        </div>

        <div className="dashboard-box">
          <h2>Total Users</h2>
          <CircularProgress progress={totalUsers} size={130} color="rgb(5, 122, 118)" />
        </div>
      </div>

      {/* <div className="last">
        <div className="dashboard-box">
          <h2>Product Stats</h2>
          <TinyBarChart data={productStats} />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
