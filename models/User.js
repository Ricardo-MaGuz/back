const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true}
    ,
    email: {
      type: String,
      unique: true,
      required: true
    },
    password:{
      type:String,
      required: true
    },
    photoURL: String,
    role: {
      type: String,
      enum: ["Hada Madrina", "Unicornio", "Mastermind"],
      default: "Unicornio"
    },
    telephone: String,
    birthday: Date,
    hairLength: {
      type: String,
      enum: ["Corto", "Mediano", "Largo"],
      default: "Mediano"
    },
    hairVolume: {
      type: String,
      enum: ["Poco", "Medio", "Abundante"],
      default: "Medio"
    },
    hairType: {
      type: String,
      enum: ["Lacio", "Ondulado", "Chino", "Afro"],
      default: "Lacio"
    },
    dyed: {
      type: Boolean,
      default: false
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment"
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("User", userSchema);
