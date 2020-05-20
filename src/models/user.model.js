import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt-nodejs";

// Scheme
const schema = new Schema({
  email: { type: String, minlength: [3, "Invalid email."] },
  password: {
    type: String,
    minlength: [6, "The password should be at least 6 characteres long."],
  },
});

// Pre-save hook to hash password
schema.pre("save", function (next) {
  const user = this;
  const saltRounds = 5;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);
    return bcrypt.hash(user.password, salt, null, (err_, hash) => {
      if (err_) return next(err);
      user.password = hash;
      return next();
    });
  });
});

// Remove password from JSON
schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Generate model
export default mongoose.model("User", schema);
