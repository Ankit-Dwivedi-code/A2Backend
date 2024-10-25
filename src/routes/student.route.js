import { Router } from "express"
import { registerStudent, verifyOtp } from "../controllers/student.controller.js"
import { upload } from "../middlewares/multer.middleware.js" 


const router = Router()



router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1,
        }
    ]),
    registerStudent
)

router.post('/verify-otp', verifyOtp);

export default router