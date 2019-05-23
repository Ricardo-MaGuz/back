require('dotenv').config();

const mongoose = require('mongoose')
const Service = require('../models/Service')
const User = require('../models/User')
require('dotenv').config();

const services = [
    {
      name: "Retoque de raíz",
      basePrice: 450,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Baño de color",
      basePrice: 500,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Balayage natural",
      basePrice: 850,
      time: 150,
      category:"Cabello"
    },
    {
      name: "Puntas de colores",
      basePrice: 900,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Tratamiento",
      basePrice: 750,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Hidratattoo",
      basePrice: 750,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Bótox capilar",
      basePrice: 750,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Keratina alaciante",
      basePrice: 850,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Corte",
      basePrice: 180,
      time: 120,
      category:"Cabello"
    },
    {
      name: "Balayage fantasía",
      basePrice: 950,
      time: 120,
      category:"Cabello"
    }
]

mongoose
.connect(process.env.DB)
.then(() => {
  Service.create(services)
  .then(services => {
    console.log(`You've created ${services.length} services successfully`)
    mongoose.connection.close()
  })
  .catch(err => {
    console.log(err)
  })
})
.catch(err => {
  console.log(err)
})