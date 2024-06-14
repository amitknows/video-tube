import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

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

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //we are chaining here ptani mile ya na mile. what is chaining?            //files is coming from multer
  //const coverImageLocalPath = req.files?.coverImage[0].path;
  //console.log("avatar local path: ", avatarLocalPath)
  //avatar is required so we will check here
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required in localpath");
  }
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  //so now we have local path of avatar we will upload it on cloudinary using the uploadOnCloudinary method imported from utils folder
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("avatar cloudinary : ", avatar);
  //again we will check for avatar
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wronh while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get login details from req.body
  // username or email check
  // search username or email in database
  // validate password
  // generate access and refresh token
  // save refresh in database
  // send tokens in cookies
  // send user data

  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }], // or is a mongodb method
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});


const logoutUser = asyncHandler(async (req, res)=>{
 await User.findByIdAndUpdate(
   req.user._id,
   {
    $set:{
      refreshToken: undefined
    }
   },
   {
    new:true
   }
  )  
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("accessToken", options)
  .json(new ApiResponse(200,{},"user logged out"))
})

export { registerUser, loginUser, logoutUser };
