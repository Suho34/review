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
  },
  {
    timestamps: true,
  },
);

export default models.User || model("User", userSchema);
