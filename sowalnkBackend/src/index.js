import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js"; // Assuming `app.js` properly exports `app`
import { sendEmail } from "./mailtrap/emails.js";

dotenv.config({ path: "./.env" });

app.use(express.json()); // Middleware to parse JSON body

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/api/v1/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await sendEmail(email, name, message);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 2000, () => {
      console.log(`Listening on port ${process.env.PORT || 2000}`);
    });
  })
  .catch((err) => {
    console.error("Error in database connection", err);
    process.exit(1);
  });
