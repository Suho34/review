import { Schema, model, models, Types } from "mongoose";

const LearningEntrySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minLength: 6,
    },

    notes: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    lastReviewedAt: {
      type: Date,
      default: null,
    },

    nextReviewAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

LearningEntrySchema.index({ userId: 1, nextReviewAt: 1 });

export const LearningEntry =
  models.LearningEntry || model("LearningEntry", LearningEntrySchema);
