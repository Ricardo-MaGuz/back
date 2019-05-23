const mongoose = require("mongoose");
const Schema = mongoose.Schema
const appointmentSchema = new mongoose.Schema(
  {
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    bookedServices: [String],
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service"
    },
    totalPrice: Number,
    appointmentDate: Date,
    duration:Number,
    comments:String,
  },
  {
    timestamps: true,
    versionKey: false
  }
)

  module.exports = mongoose.model("Appointment", appointmentSchema);