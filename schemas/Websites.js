const mongoose = require("mongoose");

const schema = mongoose.Schema({
  Name: String,
  Address: String,
  Link: String,
  Email: String,
  Phone: String,
  Facebook: String,
  Twitter: String,
  Youtube: String,
  Language: String,
  Location: String,
  Views: String,
});

schema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret._id = ret.id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const Website = mongoose.model("websiteData", schema);
module.exports = Website;
