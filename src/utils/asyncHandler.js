const asyncHandler = (fn)=>{
    (req , res , next)=>{
        // catch is used when we want a code to occur if it failed
        //reject is used when we want to force a specif error message or code 
        // catch will just catch the error but reject is in more backend and we can typeour own error
        Promise.resolve(fn(req , res , next))
        .catch((err) => {
            next(err);
        })
    }
}

export {asyncHandler};









// we will now use try/catch , async/await method for the middlewares

// const asyncHandler = (fn)=>{ // just function ke ander function
//     async (req , res , next)=>{
//         try {
//             await fn(req , res , next); // this will be the code of middleware 
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success : false,
//                 message : error.message
//             });
//         }
//     }
// };