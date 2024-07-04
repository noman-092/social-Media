const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,

    avatar: {
      fileId: String,

      url: {
        type: String,
        default:
          "https://ik.imagekit.io/pvolcynu4/default-image.jpg?updatedAt=1719674379003",
      },

      thumbnailUrl: {
        type: String,
        default:
          "https://ik.imagekit.io/pvolcynu4/default-image.jpg?updatedAt=1719674379003",
      },
    },
    otp: {
      type: Number,
      default: 0,
    },
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"posts"}],
  },
  { timestamps: true }
);
userSchema.plugin(plm);
const usercollection = mongoose.model("user", userSchema);
module.exports = usercollection;
