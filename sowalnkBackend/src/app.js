import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/auth.middleware.js";
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://sakthidev.site",
      "http://localhost:5173",
      "https://3-tier-540623662.us-east-2.elb.amazonaws.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
    ],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));

//Testing Routes
app.use("/api/v1/public", (req, res) => {
  res.status(200).json({
    success: true,
    data: "This is a public route message after clicking public button",
  });
});

app.use("/api/v1/protected", verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "This is a protected route message after clicking protected button if token is verifyed and user is authenticated",
  });
});

//import Routes
import dailyTaskRouter from "./routers/daily.routes.js";
import userAuth from "./routers/user.routes.js";
import weeklyTaskRouter from "./routers/weekly.routes.js";
import monthlyTaskRouter from "./routers/monthly.routes.js";
import yearlyTaskRouter from "./routers/yearly.routes.js";
import subscriptionRouter from "./routers/subscription.routes.js";
//Route Declaration
app.use("/api/v1/task", dailyTaskRouter);
app.use("/api/v1/user", userAuth);
app.use("/api/v1/weeklytask", weeklyTaskRouter);
app.use("/api/v1/monthlytask", monthlyTaskRouter);
app.use("/api/v1/yearlytask", yearlyTaskRouter);
app.use("/api/v1/subscription", subscriptionRouter);

export { app };

// http://localhost:5173
