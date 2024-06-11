import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FFile%3ADefault_pfp.svg&psig=AOvVaw2mdVsXw7SKDaPDrsrb7_8r&ust=1718174470297000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPD7vev40oYDFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
