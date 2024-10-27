import { Student } from '../models/student.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import {ApiError} from '../utils/ApiError.js'; // Assuming you have an ApiError utility for custom errors

export const VerifyStudent = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from cookies or authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    let verifiedToken;
    try {
      // Verify token
      verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(400, "Invalid access token: Token verification failed");
    }

    // Find student by ID from the token
    const student = await Student.findById(verifiedToken._id).select("-password -refreshToken");

    if (!student) {
      throw new ApiError(401, "Invalid access token: Student not found");
    }

    // Attach student to request object
    req.student = student;

    // Proceed to the next middleware
    next();
  } catch (error) {
    next(new ApiError(error.statusCode || 400, error.message || "Invalid access token"));
  }
});
