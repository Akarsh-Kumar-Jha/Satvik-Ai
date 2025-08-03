const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/MailSender");
const { redis } = require("../config/RedisConnection");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
      minlength: [3, "Name Should Have 3 Characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      trim: true,
    },
    Image: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["User", "Nutritionist", "Admin"],
      default: "User",
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    recipesCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Recipe",
      default: [],
    },
    savedRecipes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Recipe",
      default: [],
    },
    AiSuggestion: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiSuggestion",
    }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.Image) {
    this.Image = `https://api.dicebear.com/7.x/initials/svg?seed=${this.name}&backgroundColor=4ade80&fontSize=40&radius=50`;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email }).populate(
    'recipesCreated savedRecipes additionalDetails'
  )
  .populate({
  path: 'AiSuggestion',
  options: { sort: { createdAt: -1 } }
});
};

const User = mongoose.model("User", userSchema);
module.exports = User;
