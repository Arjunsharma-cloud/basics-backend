import mongoose, { Schema } from "mongoose";
import mongooseaggregatepaginatev2 from "mongoose-aggregate-paginate-v2";

const videoschema = new Schema({
    videofile : {
        type : String, // cloudinary url
        required : true
    },

    thumbnail : {
        type : String, // cloudinary url
        required : true
    },

    title : {
        type : String,
        required : true
    },

    disrciption : {
        type : String,
        required : true
    },

    duration : {
        type : String,
        required : true
    },

    views : {
        type : Number,
        default : 0
    },

    isPublished : {
        type : String,
        default : true
    },

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }

}, { timestamps: true });

videoschema.plugin(mongooseaggregatepaginatev2); // with this we can use aggragate tool to aggreagte more cleanly
// can also use normal function like insert del etc too
 
export const Video = mongoose.model("Video" , videoschema);