import {Student} from '../models/student.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'



export const VerifyStudent = asyncHandler(async(req, _, next)=>{


    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (typeof token !== 'string') {
            throw new ApiError(400, "Invalid token format");
        }
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const student = await Student.findById(verifiedToken?._id).select("-password -refreshToken")
    
        if (!student) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.student = student

        next()
    } catch (error) {
        throw new ApiError(400, error?.message  || "Invalid access token")
    }
})