import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIntermediateMember, setAdvanceMember } from "../store/ui-slice";
import { TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { intermediateMember, advanceMember } = useSelector(
    (state) => state.ui
  );

  const [remainingIntermediateDays, setRemainingIntermediateDays] = useState(0);
  const [remainingAdvancedDays, setRemainingAdvancedDays] = useState(0);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please login.");
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/subscription/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        dispatch(setIntermediateMember(false));
        dispatch(setAdvanceMember(false));
        setRemainingIntermediateDays(0);
        setRemainingAdvancedDays(0);

        data.data.subscription.forEach((plan) => {
          const isActive = new Date(plan.endDate) >= new Date();
          if (plan.planType === "INTERMEDIATE" && isActive) {
            const timeDifference = new Date(plan.endDate) - new Date();
            const remainingDays = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24)
            );
            setRemainingIntermediateDays(remainingDays);
            dispatch(setIntermediateMember(true));
          } else if (plan.planType === "ADVANCED" && isActive) {
            const timeDifference = new Date(plan.endDate) - new Date();
            const remainingDays = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24)
            );
            setRemainingAdvancedDays(remainingDays);
            dispatch(setAdvanceMember(true));
          }
        });
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      }
    };

    checkSubscriptionStatus();
  }, [dispatch, intermediateMember, advanceMember]);

  const plans = [
    {
      name: "BASIC",
      price: "Daily limits",
      features: [
        "Access to Daily Goals Only ",
        "Limited support",
        "Dark/Light Mode",
      ],
    },
    {
      name: "INTERMEDIATE",
      price: "₹750/year",
      features: [
        "Access upto Weekly Goals",
        "Set Theme as your wish",
        "By coupons,buy the nathan lights",
        "Progress",
      ],
    },
    {
      name: "ADVANCED",
      price: "₹1500/year",
      features: [
        "Remainders,Push Notification",
        "support team",
        "Access to all premium content",
        "Rewards with high products as coupons",
        "Streak Tracking",
      ],
    },
  ];

  const showFeatures = (planName) => {
    setSelectedPlan(planName);
  };

  const handleSubscribe = async (planName) => {
    if (planName === "BASIC") return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Add proper error handling for missing token
      if (!token) {
        throw new Error("Authentication required. Please login.");
      }

      // Create subscription
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/subscription/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planType: planName }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subscription");
      }

      // Initialize Razorpay with proper configuration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.data.amount,
        currency: "INR",
        name: "Sowalnk",
        description: `${planName} Plan Subscription`,
        order_id: data.data.id,
        handler: async function (response) {
          // Verify payment
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              throw new Error("Authentication required. Please login.");
            }
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/subscription/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
                credentials: "include",
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed"
              );
            }

            // Refresh subscription status after successful payment
            if (planName === "INTERMEDIATE") {
              dispatch(setIntermediateMember(true));
            } else if (planName === "ADVANCED") {
              dispatch(setAdvanceMember(true));
            }

            toast.success("Subscription successful!");
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed: " + error.message);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "+911234567890",
        },
        notes: {
          planType: planName,
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal closed");
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to initiate subscription: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex flex-col items-center bg-purple-200 p-8">
      <div className="w-full overflow-hidden bg-black text-white py-2 flex items-center justify-center">
        <div className="text-xl font-bold animate-marquee">
          🎉 Special Offer: Get 50% off on your first 3 months! 🎉
        </div>
      </div>

      <h1 className="text-4xl py-15 font-semibold text-gray-800 mt-8">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8 max-w-7xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="p-8 rounded-lg shadow-xl text-center text-white bg-purple-600"
          >
            <h2 className="text-2xl font-semibold mb-3">{plan.name}</h2>
            <p className="text-lg mb-6">{plan.price}</p>
            <button
              onClick={() => showFeatures(plan.name)}
              className="bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              View Features
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl place-items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Features of {selectedPlan} Plan
          </h2>
          {selectedPlan === "INTERMEDIATE" && (
            <span className="text-purple-700 text-bold text-xl ">
              ***Active {remainingIntermediateDays} days are left***
            </span>
          )}
          {selectedPlan === "ADVANCED" && (
            <span className="text-purple-700 text-bold text-xl ">
              ***Active {remainingAdvancedDays} days are left***
            </span>
          )}
          <ul className="list-disc list-inside text-lg text-gray-700">
            {plans
              .find((plan) => plan.name === selectedPlan)
              .features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>
          {selectedPlan === "BASIC" && (
            <div className="my-3 place-items-center  py-3 bg-blue-100 text-blue-700 rounded-lg w-[50%]  border border-blue-500">
              Need to use Weekly, Monthly and Yearly Tasks
              <span
                className="flex gap-3 cursor-pointer"
                onClick={() => setSelectedPlan("INTERMEDIATE")}
              >
                <TriangleAlert className="h-6 w-6" /> Subscribe Now{" "}
              </span>
            </div>
          )}
          <button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={loading}
            className={`mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={` ${
                selectedPlan === "INTERMEDIATE"
                  ? "block  px-6 py-2 rounded-md  transition-all duration-300 "
                  : "hidden"
              }
              ${
                intermediateMember
                  ? " bg-white text-blue-600 border border-blue-600"
                  : " bg-blue-600 text-white hover:bg-blue-700"
              }
              `}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </span>
            <span
              className={` ${
                selectedPlan === "ADVANCED"
                  ? "block px-6 py-2 rounded-md  transition-all duration-300 "
                  : "hidden"
              }
              ${
                advanceMember
                  ? " bg-white text-blue-600 border border-blue-600"
                  : " bg-blue-600 text-white hover:bg-blue-700"
              }
              `}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </span>
          </button>
          <button
            onClick={() => setSelectedPlan(null)}
            className="mt-4 ml-4 bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-all duration-300"
          >
            Close
          </button>
        </div>
      )}

      <style jsx="true">{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Subscription;
