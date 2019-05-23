const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: String,
    basePrice: Number,
    time: Number,
    category:{
        type: String,
        enum:["Cabello", "Diseño de Pestañas","Diseño de Cejas","Uñas"]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Service", serviceSchema);
