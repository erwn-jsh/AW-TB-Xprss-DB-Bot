const mongoose = require("mongoose");
const Schema = mongoose.Schema; // change variable name

const DrawSchema = new Schema(
  {
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    drawNo: {
      type: Number,
    },
    minimumCRS: {
      type: Number,
    },
    dateOfDraw: {
      type: Date,
    },
    noOfInvitations: {
      type: Number,
    },
  },
  {
    collections: "draws",
    timestamps: true,
  }
);

const User = mongoose.model("Draw", DrawSchema);
module.exports = User;
