import { Router } from "express";
import  registeruser  from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

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

router.get("/", (req, res) => {
  console.log("✅ it's working");
  res.send("Users route is working!");
});

export default router;