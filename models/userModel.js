const mongoose = require("mongoose");
const Joi = require("joi");
const handlerMongooseError = require("../helpers/handlerMongooseError");
const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: EMAIL_PATTERN,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  { versionKey: false }
);

userSchema.post("save", handlerMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(EMAIL_PATTERN).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_PATTERN).required(),
  password: Joi.string().min(6).required(),
});

const schemas = { registerSchema, loginSchema };
const User = mongoose.model("users", userSchema);

module.exports = { User, schemas };
