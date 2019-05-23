const router = require("express").Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const auth = require("../handlers/jwts");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");

//Register
router.post(
  "/registrar",
  [
    check("name", "Escribe tu nombre, por favor")
      .not()
      .isEmpty(),
    check("email", "Por favor, escribe un e-mail válido").isEmail(),
    check(
      "password",
      "Por favor escribe una contraseña de 6 o más caracteres"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "El usuario ya existe" }] });
      }
      const photoURL = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      user = new User({
        name,
        email,
        photoURL,
        password
      });

      const salt = await bcrypt.genSalt(11);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //JWT
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error de servidor");
    }
  }
);
// Get all users

router.get('/', auth , async (req, res) => {
  try {
    const users = await User.find().sort({ name: -1})
    res.json(users)
  } catch (err) {
    console.error(err.message)
      res.status(500).send('Error del servidor')
  }
})

//Uno perfil
router.get("/:user_id", async (req, res) => {
  try {
    const user = await User.findOne(req.params.id)
    if (!user)
      return res.status(400).json({ msg: "No encontramos el usuario" });
    res.json(user);
  } catch (err) {
    if(err.kind == 'ObjectId'){
      return res.status(400).json({ msg: "No encontramos el usuario" });
    }
    res.status(500).send("Error del servidor");
  }
});

//Borrar perfil, usuario y citas
router.delete("/:user_id", auth, async (req, res) => {
  try {
    //To do - Eliminar appointments
    await User.findOneAndRemove( { _id: req.user.id } );
    res.json( {msg: 'Adiós pequeño pony'} )
  } catch (error) {
    res.status(500).send('Error del servidor')
  }
});


module.exports = router;
