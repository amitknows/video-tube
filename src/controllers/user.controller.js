import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  //validation - not empty
  //check if user(email/username)already exist or not if user exist then return user exist
  //check for images , check for avtar
  //upload them to cloudinary, avtar
  //create user object- create entry in db
  // remove password and refresh token field from response
  //check for user creation
  // return response

  const { fullName, email, username, password } = req.body;
  console.log("email : ", email, password);

  /********-------------Beginner Method of validation on each field----------**********
 
 if (fullName === "") {
      throw new ApiError(400, "fullname is required");
    }
********************/

  /**************------------------Advance Method of validation------------------------*********************/
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }


//Future assignment check validation on valid email, username, password



const existedUser = User.findOne({
    $or: [{ username }, { email }]
})

if(existedUser){
  throw new ApiError(409, "User already exist")
}

const avatarLocalPath = req.files?.avatar[0]?.path;   //we are chaining here ptani mile ya na mile. what is chaining?            //files is coming from multer
const coverImageLocalPath = req.files?.coverImage[0].path;

//avatar is required so we will check here 
if(!avatarLocalPath){
  throw new ApiError(400, "Avatar file is required")
}

//so now we have local path of avatar we will upload it on cloudinary using the uploadOnCloudinary method imported from utils folder
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//again we will check for avatar
if(!avatar){
  throw new ApiError(400, "Avatar file is required")
}



const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase(),
})

const createdUser = User.findById(user._id).select(
  '-password -refreshToken'
)

if(!createdUser){
  throw new ApiError(500, "Something went wronh while registering the user")
}


return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered successfully")
)


});
export { registerUser };
