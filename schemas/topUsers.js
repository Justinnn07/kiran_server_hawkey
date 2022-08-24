const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  instagram: String,
  facebook: String,
  twitter: String,
  channel: String,
});

schema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret._id = ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const TopUsers = mongoose.model("topUsers", schema);
module.exports = TopUsers;
