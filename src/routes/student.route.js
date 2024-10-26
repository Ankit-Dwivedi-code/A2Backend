import { Router } from "express"
import { loginStudent, logoutStudent, registerStudent, verifyLoginOtp, verifyOtp } from "../controllers/student.controller.js"
import { upload } from "../middlewares/multer.middleware.js" 
import { VerifyStudent } from "../middlewares/auth.middleware.js"


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

//Login
router.route('/login').post(loginStudent)
router.route('/verify-login').post(verifyLoginOtp)

//Secured routes
router.route('/logout').post(VerifyStudent, logoutStudent)

export default router