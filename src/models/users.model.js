import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
        },

        avatar: {
            type: String, //cloudinary url -> 3rd party service to save image/videos it hjust give a url back
            required: true,
        },

        coverImage: {
            type: String, //cloudinary url
        },

        watchHistory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },

        password: {
            type: String,
            required: [true, "PASSWORD IS REQUIRED"],
        },

        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

//now we want to encypt the password before saving so now we will use pre middleware
// we will add the event save so jsut before saving in the db a code will be performed

userSchema.pre("save", async function (next) {
    // we need the refrence form the userschema to use this

    // beacuse if there is any chnage like change in username or anything,this code will run before saving
    //so we write this if condition
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10); // takes time
    next(); // this is just the flag to move on to the next part is there is any
    // maybe a one more middleware
});

// now a custom instance method to check password
// middleware listens the event and custom instance method are called

userSchema.methods.isPasswordCorrect = async function (password) {
    // password that user write
    return await bcrypt.compare(password, this.password); //this.password is the real in encrypted form
};

// now lets create a method to create tokens
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id, //mongodb creates it
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
