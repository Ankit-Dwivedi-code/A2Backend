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
    res.status(200).json({
        message : "Ok"
    })
})

export {registerStudent}