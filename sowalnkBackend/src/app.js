import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: [
      "https://sakthidev.site",
      "https://3-tier-540623662.us-east-2.elb.amazonaws.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));
app.use(cookieParser());

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
