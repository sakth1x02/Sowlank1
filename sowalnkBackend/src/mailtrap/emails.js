import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { transporter } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: email,
      subject: "Welcome to Sowalnk!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendEmail = async (email, name, message) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: "support@sowalnk.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50; text-align: center;">New Contact Form Submission</h2>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Name:</strong> ${name}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin: 10px 0;"><strong style="color: #4CAF50;">Message:</strong> ${message}</p>
          </div>
          <hr style="border: 0; height: 1px; background: #ddd;">
      <p style="text-align: center; color: #666; font-size: 14px;">This message was sent via your website contact form.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(`Error in sending email`, error);

    throw new Error(`Error in sending email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.BREVO_EMAIL,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
