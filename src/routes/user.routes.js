import { Router } from "express";
import  registeruser  from "../controllers/user.controller.js";

const router = Router()


router.route("/register").post(registeruser , (req ,res)=>{
    res.send("you are here to register")
});

router.get("/", (req, res) => {
  console.log("✅ it's working");
  res.send("Users route is working!");
});

export default router;