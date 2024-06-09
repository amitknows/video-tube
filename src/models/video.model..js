import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, {Schema} from mongoose;


const videoSchema = new Schema({
videoFile:{
    type:String, //Cloudinary url
    required:true,
},
thumbnail:{
    type: String, //Cloudinary url
    required:true,
},
owner:{
    type: Schema.Type.ObjectId,
    ref: "User"
},
title:{
    type: String,
    required:true,
    
},
description:{
    type: String,
    required:true,

},

duration:{
    type: Number, //Cloudinary
    required:true,
},
views:{
    type: Number,
    default: 0,
    required:true,
},
isPublished:{
    type: Boolean,
    default: true,
}

},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video', videoSchema);