const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: String,
    media: {
      fileId: String,
      url: String,
      thumbnailUrl: String,
    },
    user: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  { timestamps: true }
);
const postCollection = mongoose.model("post", postSchema);
module.exports = postCollection;
