import {asyncHandler} from '../utils/asyncHandler.js'
import {Student} from "../models/student.model.js"
import { ApiError } from '../utils/apiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { generateOtp } from '../utils/otpGenerator.js';
import { sendEmail } from '../utils/sendEmail.js';


const generateAccessAndRefreshTokens = async(studentId) =>{
    try {
        const student = await Student.findById(studentId)
        const accessToken =   student.generateAccessToken()
        const refreshToken = student.generateRefreshToken()

        student.refreshToken = refreshToken
        await student.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Internal server error while generating access and refresh token")
    }
}

const registerStudent = asyncHandler(async(req, res) =>{
    const {username, email, password} = req.body;

    // console.log("username", username);
    

    // Check for empty fields
    if (
        [username, email, password].some((field) => !field)
    ) {
        throw new ApiError(400, 'All fields are required');
    }

    // Check for existing user
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
        throw new ApiError(409, 'Student already exists');
    }

    // Check for avatar image
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar image is required');
    }

    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(400, 'Failed to upload avatar image');
    }

    // Generate OTP and set expiration
    const { otp, otpExpires } = generateOtp();

    const student = new Student({
        username,
        email,
        password,
        avatar: avatar.url,
        otp,
        otpExpires
    })

    // Save the new student to the database
    await student.save();

    return res.status(201).json(
        new ApiResponse(201, { email }, 'OTP sent to your email')
    );
})

/**
 * Verifies a student's OTP and completes the registration process.
 */
export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP are required');
    }

    const student = await Student.findOne({ email });

    if (!student || student.isVerified) {
        throw new ApiError(400, 'Invalid or already verified student');
    }

    if (student.otp !== otp || student.otpExpires < Date.now()) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    // Mark student as verified and clear OTP fields
    student.isVerified = true;
    student.otp = undefined;
    student.otpExpires = undefined;
    await student.save();

    // Remove sensitive data before sending the response
    const verifiedStudent = await Student.findById(student._id).select('-password -refreshToken');

    return res.status(200).json(
        new ApiResponse(200, verifiedStudent, 'Student verified and registered successfully')
    );
});

export {registerStudent, verifyOtp}