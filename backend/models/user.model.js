const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema ({

fullName: { type: String},
email: { type: String},
password: { type: String},
created0n: { type: Date, default: new Date().getTime()}, });

module.exports = mongoose.model("User", userSchema);