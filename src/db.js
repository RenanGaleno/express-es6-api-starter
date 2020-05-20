import mongoose from "mongoose";
import config from "./config";

mongoose.Promise = global.Promise;

export default (cb) => {
  mongoose
    .connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((db) => {
      console.log("\x1b[34m[API]", "DB connected", "\x1b[0m");
      cb(db);
    })
    .catch((error) => {
      console.error("\x1b[31m[API]", "DB error:", error.message, "\x1b[0m");
    });
};
