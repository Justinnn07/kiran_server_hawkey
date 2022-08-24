const mongoose = require("mongoose");

const schema = mongoose.Schema({
  ip: String,
  alive: Boolean,
  code: Number,
});

schema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret._id = ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const Ip = mongoose.model("ipData", schema);
module.exports = Ip;
