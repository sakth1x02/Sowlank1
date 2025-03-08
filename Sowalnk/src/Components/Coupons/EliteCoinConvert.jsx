import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, convertEliteCoinsToCoupon } from "../../store/user-slice";

const EliteCoinConvert = () => {
  const dispatch = useDispatch();
  const { users, loggedInUser } = useSelector((store) => store.user);
  const loggedInUserData = users.find((user) => user._id === loggedInUser._id);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!loggedInUserData) {
    return <p>Loading...</p>;
  }
  const COUPON_COST = 5;
  // Function to handle conversion
  const handleConvert = async () => {
    if (loggedInUserData?.eliteCouponCards.length >= 1) {
      toast.warning("You can only have 1 Elite Coupon at a time!");
      return;
    }

    if (loggedInUserData?.eliteCoins < COUPON_COST) {
      toast.error("Not enough Elite Coins! You need at least 5.");
      return;
    }

    // Deduct 1000 coins and add a new coupon
    try {
      await dispatch(
        convertEliteCoinsToCoupon({ userId: loggedInUserData._id })
      ).unwrap();
      toast.success("Successfully redeemed a ₹1000 coupon!");
    } catch (error) {
      console.error("Error converting elite coins:", error);
      toast.error("Error converting elite coins. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Elite Coin Convert
      </h1>

      {/* Display Elite Coin Balance */}
      <div className="text-center mb-6 flex justify-center items-center gap-5">
        <p className="text-lg">Your Balance:</p>
        <p className="text-2xl font-bold">
          👑 {loggedInUserData?.eliteCoins} Elite Coins
        </p>
      </div>

      {/* Convert Button */}
      <div className="text-center">
        <button
          onClick={handleConvert}
          disabled={
            loggedInUserData?.eliteCouponCards.length >= 1 ||
            loggedInUserData?.eliteCoins < COUPON_COST
          }
          className={`px-6 py-2 text-white font-semibold rounded-lg ${
            loggedInUserData?.eliteCouponCards.length >= 1 ||
            loggedInUserData?.eliteCoins < COUPON_COST
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          Redeem ₹1000 Coupon(5 Elite Coins)
        </button>
      </div>

      {/* Display Coupons */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        {loggedInUserData?.eliteCouponCards.map((coupon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg shadow-md bg-gray-100"
          >
            <p className="text-lg font-semibold">🎟 ₹1000 Coupon</p>
            <p className="text-gray-700 text-sm">{coupon.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Show a message if they have no coupons */}
      {loggedInUserData?.eliteCouponCards.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          You haven't redeemed any coupons yet.
        </p>
      )}
    </div>
  );
};

export default EliteCoinConvert;
