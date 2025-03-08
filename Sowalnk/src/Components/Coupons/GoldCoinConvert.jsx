import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, convertGoldCoinsToCoupon } from "../../store/user-slice";

const GoldCoinConvert = () => {
  const dispatch = useDispatch();
  const { users, loggedInUser } = useSelector((store) => store.user);
  const loggedInUserData = users.find((user) => user._id === loggedInUser._id);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!loggedInUserData) {
    return <p>Loading...</p>;
  }

  // Cost of one coupon card in normal coins
  const COUPON_COST = 5;

  // Function to handle coin conversion
  const handleConvertCoins = async () => {
    if (loggedInUserData?.goldCouponCards.length >= 5) {
      toast.warning("You can only have 5 coupons at a time!");
      return;
    }

    if (loggedInUserData?.goldCoins < COUPON_COST) {
      toast.warning("Not enough gold coins to convert.");
      return;
    }

    // Deduct coins and generate a new coupon card
    try {
      await dispatch(
        convertGoldCoinsToCoupon({ userId: loggedInUserData._id })
      ).unwrap();
      toast.success("Coupon card generated successfully!");
    } catch (error) {
      console.error("Error generating coupon card:", error);
      toast.error("Error generating coupon card. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Gold Coin Convert</h1>

      {/* Display available normal coins */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold text-blue-800">
          Available Gold Coins: {loggedInUserData?.goldCoins || 0}
        </p>
      </div>

      {/* Convert button */}
      <div className="text-center mb-6">
        <button
          onClick={handleConvertCoins}
          className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors ${
            loggedInUserData?.goldCouponCards.length >= 5 ||
            loggedInUserData?.goldCoins < COUPON_COST
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Convert to Coupon Card ({COUPON_COST} Coins)
        </button>
      </div>

      {/* Display generated coupon cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loggedInUserData?.goldCouponCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg shadow-md bg-gray-100 space-y-8 py-10"
          >
            <p className="text-xl font-semibold text-green-800">{card}</p>
            <p className="text-sm text-gray-600">Redeemable for rewards</p>
          </motion.div>
        ))}
      </div>

      {/* Message when maximum cards are reached */}
      {loggedInUserData?.goldCouponCards.length >= 5 && (
        <p className="text-center text-gray-600 mt-6">
          You have reached the maximum number of coupon cards.
        </p>
      )}
    </div>
  );
};

export default GoldCoinConvert;
