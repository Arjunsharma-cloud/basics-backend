import { asyncHandler } from "../utils/asyncHandler.js";

console.log(12)
const registeruser = asyncHandler(async (req , res)=>{
    console.log("its running");
    res.status(200).json({
        message : "ok"
    })
})

export default registeruser;