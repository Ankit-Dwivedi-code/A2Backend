import {asyncHandler} from '../utils/asyncHandler.js'
import {Student} from "../models/student.model.js"
import { ApiError } from '../utils/apiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';


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

    const student = new Student({
        username,
        email,
        password,
        avatar: avatar.url
    })

    // Save the new student to the database
    await student.save();

    // Remove sensitive data before sending the response
    const createdStudent = await Student.findById(student._id).select('-password -refreshToken');

    if (!createdStudent) {
        throw new ApiError(500, 'Something went wrong in creating the student');
    }

    // Send success response
    return res.status(201).json(
        new ApiResponse(201, createdStudent, 'Student registered successfully')
    );
})

export {registerStudent}