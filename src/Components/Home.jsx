import React from 'react';
import '../css/Home.css';
// import hand_icon from  '../assets/shopping-cart-dark.jpg';

const Home = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-text"><span>Product</span> Shop</h1>
        <p className="hero-description">
          Browse the Collection of our Best top Interesting Products.
          You will definitely find what you are looking for.
        </p>
      </div>
      <div className="hero-image">
        {/* <img src={hand_icon} alt="" /> */}
      </div>
    </div>
  );
};

export default Home;
