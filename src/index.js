import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import connect_DB from "./db/index.js";
import app from "./app.js"

// const app = express();




connect_DB() 
.then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log("PORT IS LISTENING!!!" , process.env.PORT);
    })
})
.catch((error)=>{
    console.log("error in connecting DB" ,error);
})   
console.log(process.env.PORT)

//here a whole function is experted from ./db/index.js 
//it is the same functiion that is written in the end 




// ()() this kind of function initailize the function written in first ()

// so asnyc is a promise and await wait until the promise is resolved
// whatever the promise is 
// so it is  usually inside the async promise 


//********************************************** */

// try and catch will only work  if mongodb connection fails 
// but if there are any error after connection then app.on will listen to the error event



//************************** CODE ************************** */



// (async ()=>{
//     try { // we will try to connect the db and if there are any error it will be used by catch
//         await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
//         app.on("error" , (error)=>{
//             console.log(`error : ${error}`);
//             throw error;
//         })
//         //now after db is connected and we are waiting for it 
//         app.listen(process.env.PORT , ()=>{
//             console.log(`app is listening on the port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.log("error" ,error);
//         throw error;
//     }

// })()