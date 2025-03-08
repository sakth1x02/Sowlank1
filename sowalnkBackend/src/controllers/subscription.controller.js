import Razorpay from "razorpay";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  INTERMEDIATE: {
    amount: 75000, // Amount in paise (₹750)
    currency: "INR",
    interval: "monthly",
    period: 90, // days
  },
  ADVANCED: {
    amount: 155000, // Amount in paise (₹1550)
    currency: "INR",
    interval: "yearly",
    period: 365, // days
  },
};

const createSubscription = asyncHandler(async (req, res) => {
  const { planType } = req.body;
  const userId = req.user._id;

  if (!planType || !PLANS[planType]) {
    throw new ApiError(400, "Invalid plan type");
  }

  const plan = PLANS[planType];

  try {
    // Create order instead of subscription
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: userId.toString(),
        planType,
      },
    });

    // Create subscription record in database
    const subscription = await Subscription.create({
      userId,
      planType,
      razorpayOrderId: order.id,
      status: "created",
      amount: plan.amount,
    });
    await subscription.save();

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to create order: " + error.message);
  }
});

const verifySubscription = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const subscription = await Subscription.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!subscription) {
    throw new ApiError(404, "Order not found");
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid signature");
  }

  // Update subscription status
  subscription.status = "active";
  subscription.razorpayPaymentId = razorpay_payment_id;
  subscription.startDate = new Date();
  const plan = PLANS[subscription.planType];
  subscription.endDate = new Date(
    Date.now() + plan.period * 24 * 60 * 60 * 1000
  );

  await subscription.save();

  return res.status(200).json({
    success: true,
    data: subscription,
    message: "Payment verified successfully",
  });
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const subscription = await Subscription.find({
    userId: req.user._id,
    status: "active",
  });

  return res.status(200).json({
    success: true,
    data: { subscription },
    message: "Subscription status retrieved",
  });
});

export { createSubscription, verifySubscription, getSubscriptionStatus };
