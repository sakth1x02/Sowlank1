import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../store/user-slice";
import { Loader } from "lucide-react";
const Coupons = () => {
  const dispatch = useDispatch();
  const { intermediateMember, advanceMember } = useSelector(
    (state) => state.ui
  );
  const { loggedInUser, users } = useSelector((store) => store.user);
  const loggedInUserData = users.find(
    (user) => user?._id === loggedInUser?._id
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!loggedInUserData) {
    return (
      <Loader className="w-10 h-10 text-purple-700  animate-spin mx-auto" />
    );
  }

  const coinTypes = [
    {
      type: "Normal Coins",
      description: "Basic coins for everyday rewards",
      color: "bg-blue-500",
      icon: "🪙",
      amount: loggedInUserData?.normalCoins,
      locked: false,
      link: "/coupons/normal",
    },
    {
      type: "Gold Coins",
      description: "Premium currency for special items",
      color: "bg-yellow-500",
      icon: "💰",
      amount: loggedInUserData?.goldCoins,
      locked: !intermediateMember,
      link: "/coupons/gold",
    },
    {
      type: "Elite Coins",
      description: "Exclusive currency for rare items",
      color: "bg-purple-500",
      icon: "👑",
      amount: loggedInUserData?.eliteCoins,
      locked: !advanceMember,
      link: "/coupons/elite",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Coin Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coinTypes.map((coin, index) => (
          <motion.div
            key={coin.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl shadow-lg overflow-hidden relative"
          >
            {/* Lock overlay */}
            {coin.locked && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <p className="text-sm font-semibold text-gray-700 text-center">
                  Upgrade to{" "}
                  {coin.type === "Gold Coins" ? "Intermediate" : "Advanced"}{" "}
                  Plan
                </p>
              </div>
            )}

            <div className={`${coin.color} p-6 text-white`}>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{coin.icon}</span>
                <pre className="text-xl font-bold">{coin.type}</pre>
              </div>
              <p className="mt-2 text-sm opacity-90">{coin.description}</p>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Balance</span>
                <span className="text-2xl font-bold">{coin.amount}</span>
              </div>
              <div className="flex justify-center items-center">
                <Link
                  to={coin.link}
                  disabled={coin.locked}
                  className={`mt-8 w-full bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors ${
                    coin.locked
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Convert to Coupon
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
