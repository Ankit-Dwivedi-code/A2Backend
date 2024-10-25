// utils/otpGenerator.js

/**
 * Generates a random OTP with the specified number of digits and an expiration time.
 * @param {number} length - Length of the OTP (default is 6).
 * @param {number} expiresInMinutes - Expiration time in minutes (default is 15).
 * @returns {Object} An object containing the OTP and its expiration timestamp.
 */
export function generateOtp(length = 6, expiresInMinutes = 15) {
    const otp = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    const otpExpires = Date.now() + expiresInMinutes * 60 * 1000; // Current time + expiration duration in milliseconds

    return { otp, otpExpires };
}
