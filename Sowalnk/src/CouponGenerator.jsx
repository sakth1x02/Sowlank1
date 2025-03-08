import React, { useState } from 'react';
import './CouponGenerator.css';

const CouponGenerator = () => {
  const [couponCode, setCouponCode] = useState('');
  const [coupons, setCoupons] = useState([]);

  const generateCoupon = () => {
    const newCoupon = `COUPON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setCoupons([...coupons, newCoupon]);
  };

  const handleInputChange = (e) => {
    setCouponCode(e.target.value);
  };

  const addCoupon = () => {
    if (couponCode) {
      setCoupons([...coupons, couponCode]);
      setCouponCode('');
    }
  };

  return (
    <div>
      <h1>Coupon Generator</h1>
      <button onClick={generateCoupon}>Generate Random Coupon</button>
      <input 
        type="text" 
        value={couponCode} 
        onChange={handleInputChange} 
        placeholder="Enter custom coupon code" 
      />
      <button onClick={addCoupon}>Add Coupon</button>
      <ul>
        {coupons.map((coupon, index) => (
          <li key={index}>{coupon}</li>
        ))}
      </ul>
    </div>
  );
};

export default CouponGenerator;
