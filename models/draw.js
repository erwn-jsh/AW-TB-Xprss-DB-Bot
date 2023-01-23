const mongoose = require("mongoose");
const Schema = mongoose.Schema; // change variable name

const DrawSchema = new Schema(
  {
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    drawNo: {
      type: Int32,
    },
    minimumCRS: {
      type: Double,
    },
    dateOfDraw: {
      type: Date,
    },
    noOfInvitations: {
      type: Double,
    },
  },
  {
    collections: "draws",
  }
);

const User = mongoose.model("Draw", DrawSchema);
module.exports = User;
