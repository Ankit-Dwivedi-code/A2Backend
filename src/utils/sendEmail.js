// utils/sendEmail.js
import nodemailer from 'nodemailer';

/**
 * Sends an email with the specified content.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} content - Content of the email.
 */
export async function sendEmail(to, subject, content) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: content
    });
}
