const { redis } = require("../config/RedisConnection");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const { sendMail } = require("../utils/MailSender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.sendMailAndCacheData = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;
    if (!name || !email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required!",
      });
    }
    const userDet = await User.findByEmail(email);

    if (userDet) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered!",
      });
    }

    const sendVerificationEmail = async (email, value) => {
      try {
        const mailResponce = await sendMail(
          email,
          "SatvikAI Account Verification",
          `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f7f7f7; color: #333;">
      <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753219931/SatvikAi_Logo_h9lxxc.png" alt="SatvikAI Logo" style="width: 120px; margin-bottom: 20px;" />
        </div>

        <h2 style="text-align: center; color: #2e7d32;">Verify Your Email</h2>

        <p>Hello,</p>
        <p>Thank you for registering with <strong>SatvikAI</strong>. To complete your signup, please verify your email using the OTP below:</p>

        <div style="background-color: #e8f5e9; padding: 16px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; color: #1b5e20; margin: 20px 0;">
          ${value}
        </div>

        <p>This OTP is valid for the next <strong>5 minutes</strong>. Please do not share it with anyone.</p>

        <p>Regards,<br/>Team SatvikAI</p>
      </div>
    </div>`
        );
        console.log("Mail Response:- ", mailResponce);
      } catch (error) {
        console.error("Mail Sending Failed!", error.message);
      }
    };

    const otpVal = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await sendVerificationEmail(email, otpVal);
    const newUser = {
      name,
      email,
      password,
      role: accountType,
      otpVal,
    };

    console.log("User :- ", newUser);

    await redis.setex(email, 300, JSON.stringify(newUser));

    // const newUser = await User.create({
    //     name,email,password,role:accountType
    // });

    return res.status(200).json({
      success: true,
      message: "Otp Sent and User Details Cached.",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Creating User!",
      error: error.message,
    });
  }
};

exports.verifyAndCreate = async (req, res) => {
  try {
    const { Email, Otp } = req.body;

    if (!Email) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Email!",
      });
    }
    if (!Otp) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Otp!",
      });
    }

    const findUser = await User.findByEmail(Email);

    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Registered!",
      });
    }

    const userCachedData = await redis.get(Email);

    if (!userCachedData) {
      return res.status(400).json({
        success: false,
        message: "Otp Expired!",
      });
    }

    const { name, email, password, role, otpVal } = userCachedData;

    if (Otp !== otpVal) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    const createdUser = await User.create({
      name,
      email,
      password,
      role,
    });
    await redis.del(Email);

    return res.status(201).json({
      success: true,
      message: "User Created And Saved In DB.",
      createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Verifying User!",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: "Give All Deatils!",
      });
    }
    const userExists = await User.findByEmail(email);

    if (!userExists) {
      return res.status(403).json({
        success: false,
        message: "User Not Exist Create Account.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExists.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const payload = {
      id: userExists._id,
      email: userExists.email,
      role: userExists.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "2h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });

    return res
  .cookie("accessToken", accessToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 2 * 60 * 60 * 1000,
})
.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
})
.json({
    success: true,
    message: "Logged in successfully!",
    User: userExists,
    accessToken,
    refreshToken,
  });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Occuered While Loging In User!",
      error: error.message,
    });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
      });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Refresh Token Inavlid!",
      });
    }

    const { id, email, role } = payload;

    const newAccessToken = jwt.sign(
      {
        id,
        email,
        role,
      },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "2h",
      }
    );

    return res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Successfully Token Refreshed",
        newAccessToken,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Token Refresh",
      error:error.message
    });
  }
};

exports.getUser = async(req,res) => {
  try {
    const {email} = req.user;
    if(!email){
      return res.status(403).json({
        success:false,
        message:'User Not Authenticated Login Again'
      });
    };

    const findUser = await User.findByEmail(email);

    if(!findUser){
      return res.status(403).json({
        success:false,
        message:"User Not Found!"
      });
    };

    return res.status(200).json({
      success:true,
      message:'User Fetching Done.',
      data:findUser
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error While Fetching User!",
      error:error.message
    })
  }
}

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
