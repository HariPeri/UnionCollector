import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userModel = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Static signup method
// userModel.statics.signup = async function (email, password) {
//   const exists = await this.findOne({ email });

//   if (exists) {
//     throw new Error("Email already in use");
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);

//   const user = await this.create({ email, password: hash });

//   return user;
// };
const model = mongoose.model("User", userModel);

export default model;
