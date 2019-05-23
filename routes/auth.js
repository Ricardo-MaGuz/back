const router = require("express").Router();
const bcrypt = require("bcryptjs");
const auth = require("../handlers/jwts");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error de servidor");
  }
});

//Athenticate
router.post(
  "/",
  [
    check("email", "Por favor, escribe un e-mail válido").isEmail(),
    check("password", "El password es obligatorio").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "El usuario o contraseña son incorrectos" }]
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "El usuario o contraseña son incorrectos" }]
          });
      }
      //JWT
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 6000 * 60 * 24 },
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

module.exports = router;
