import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { sendEmail } from "./mailtrap/emails.js";
dotenv.config({
  path: "./env",
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
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error in data response", err);
    process.exit(1);
  });
