import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';// interview- jwt is a bearer token. Like a key of house. Jiske pas h wahi access kar sakta hai.


const userSchema = new Schema({
    username:{
        type: String,
        required:true,
        unique: true,
        lowerCase:true,
        trim:true,
        index:true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
        lowerCase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
    coverImage:{
        type: String, // cloudinary url
       
    },
    password:{                  //bcryptjs- it helps to hash password
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{            // jwt- it create tokens
        type:String,
        
    },
    watchHistory:[        //mongoose-aggregate-paginate-v2
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ]
}, {timestamps:true});

userSchema.pre('save', async function(next){                //do not use arrow function here. arrow function doesnot have access to this keyword
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)         // mujhe lgta h yaha await lagega *Logic Building 42:30 sir ko bhi lga
    next();
})



userSchema.methods.isPasswordCorrect = async function (password){    // using 'methods' we can define our own custom methods
   return await bcrypt.compare(password,this.password)
}




userSchema.methods.generateAccessToken= function(){
  return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken= function(){
  return  jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKE_EXPIRY
        }
    )

}

export const User = mongoose.model('User', userSchema)