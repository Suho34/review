import { models, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default models.User || model("User", userSchema);
