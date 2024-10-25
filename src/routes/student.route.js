import { Router } from "express"
import { registerStudent } from "../controllers/student.controller.js"
// import { upload } from "../middleware/multer.middleware.js" 


const router = Router()



router.route("/register").post(
   
    registerStudent
)

export default router