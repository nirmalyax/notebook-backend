const express = require("express");
const Users = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const JWT_SECRET = "main hoon don";

//creating the user
router.post(
  "/createnewuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }).exists(),
    body("username", "Enter a valid username").isLength({ min: 5 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array.json("") });
    }

    try {
      let user = await Users.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "email already exists" });
      }
      user = await Users.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ error: "username already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPas = await bcrypt.hash(req.body.password, salt);

      user = await Users.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: secPas,
      });
      const data = {
        id: user.id,
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      //console.log(jwtData)
      res.json({ jwtData });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error");
    }
  }
);

//authentication for login
router.post(
  "/login", 
  [
    body("username", "Enter a valid username").isLength({ min: 5 }),
    body("password", "Enter a valid Password")
      .isLength({
        min: 5,
      })
      .exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().json("")});
    }
    const { username, password } = req.body;
    try {
      let  user = await Users.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "use correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "use correct credentials" })
      }
      const data = {
        id: user.id,
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      //console.log(jwtData)
      res.json({ jwtData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
  }
);

module.exports = router;
