import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    school: {
      name: { type: String, default: "Delhi Public School" },
      city: { type: String, default: "Bokaro Steel City" }
    },
    role: { type: String, default: "teacher" }
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
