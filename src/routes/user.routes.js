import { Router } from "express";
import { registeruser , loginuser , logoutuser , refreshaccessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


 


router.route("/register").post( 
   upload.fields([
      {

        name:"avatar",
        maxCount:1
      },
      {

        name:"coverImage",
        maxCount:1
      }
	  
   ]), 
   registeruser );

router.route("/login").post(loginuser);

router.route("/logout").post(verifyJWT , logoutuser)

router.route("/refresh").post(refreshaccessToken);

router.get("/", (req, res) => {
  console.log("✅ it's working");
  res.send("Users route is working!");
});

export default router;