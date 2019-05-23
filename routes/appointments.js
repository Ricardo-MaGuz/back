const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../handlers/jwts");

const User = require("../models/User");
const Service = require("../models/Service");
const Appointment = require("../models/Appointment");

//Create Post
router.post(
  "/agendar",
  [
    auth,
    [
      check("serviceName", "Escoge un servicio")
        .not()
        .isEmpty(),
      check("appointmentDate", "Escoge una fecha")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      bookedServices,
      totalPrice,
      appointmentDate,
      duration,
      comments
    } = req.body;

    const appointmentFields = {};
    appointmentFields.user = req.user.id;
    //appointmentFields.service = req.service.id;
    if (totalPrice) appointmentFields.totalPrice = totalPrice;
    if (appointmentDate) appointmentFields.appointmentDate = appointmentDate;
    if (duration) appointmentFields.duration = duration;
    if (comments) appointmentFields.comments = comments;
    if (bookedServices) {
      appointmentFields.bookedServices = bookedServices.split(",");
    }
    try {
      let appointment = await Appointment.findOne({ user: req.user.id }).select(
        "-password"
      );
      //Update
      if (appointment) {
        appointment = await User.findOneAndUpdate(
          { user: req.user.id },
          { $set: appointmentFields },
          { new: true }
        );

        return res.json(appointment)
      }
      //Create
      appointment = new Appointment(appointmentFields)
      
      await appointment.save();
      res.json(appointment)

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Get all appointments

router.get("/", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Get all appointments by user
router.get("/mis-citas", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Get one appointment

router.get("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404);
    }
    res.json(appointment);
  } catch (err) {

    console.error(err.message);
    if (err.kind === "ObjectId") res.status(500).send("Error del servidor");
  }
});

// Delete an appointment

router.delete("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if(appointment.user.role.toString() !== "Hada Madrina" && appointment.user.role.toString() !== "Mastermind"){
      return res.status(401).json({msg: "No tienes autorización"})
    }

    await appointment.remove();
  } catch (err) {
    console.error(err.message);
    if (!appointment) {
      return res.status(404);
    }
    res.status(500).send("Error del servidor");
  }
});

// Delete an appointment as user

router.delete("borrar/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    //check user
    if(appointment.user.toString() !== req.user.id){
      return res.status(401).json({msg: "No tienes autorización"})
    }
    if (!appointment) {
      return res.status(404);
    }
    await appointment.remove();
  } catch (err) {
    console.error(err.message);
    if (!appointment) {
      return res.status(404);
    }
    res.status(500).send("Error del servidor");
  }
});


module.exports = router;
