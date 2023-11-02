const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    //unique: true,
  },
  email: {
    type: String,
    required: true,
    //unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model("user", UserSchema);
Users.createCollection();
module.exports = Users;
