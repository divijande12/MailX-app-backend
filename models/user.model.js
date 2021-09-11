const mongoose = require("mongoose");

const schema = mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
});

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const User = mongoose.model("Users", schema);

module.exports = User;
