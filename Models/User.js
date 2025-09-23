import mongoose from "mongoose";
import passportlocalmongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

userSchema.plugin(passportlocalmongoose);

const User = mongoose.model("User", userSchema);
export default User;