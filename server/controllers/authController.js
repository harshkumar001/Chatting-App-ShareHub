import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User Already Exist", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User({
      ...obj,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "Register Successfully", success: true, savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

//  LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      // return res;
      // .status(400)
      // .send({ message: "User Not Found", success: false });
      return res
        .status(400)
        .json({ message: "User Not Found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user.password;
    res.status(200).json({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log("Error in Login Controller", error);
    res
      .status(500)
      .json({ message: `Error in Login Controller ${error.message}` });
  }
};
