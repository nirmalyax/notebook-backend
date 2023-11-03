const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var fetchuser = require("../middleware/fetchuser");
var jwt = require("jsonwebtoken");
const Types = require("mongoose");

const JWT_SECRET = "Harryisagoodb$oy";

//creating the user without login
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
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "email already exists" });
      }
      user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(400).json({ error: "username already exists" });
      }
 
      const salt = await bcrypt.genSalt(10);
      const secPas = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
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
      return res.status(400).json({ errors: errors.array().json() });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "use correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "use correct credentials" });
      }
      const data = {
        id: user.id,
      };
      //console.log({data})
      const jwtData = jwt.sign(data, JWT_SECRET);
      //console.log(jwtData)
      res.json({ jwtData, data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

 //get user details
 router.post("/getuser", fetchuser, async (req, res) => {
   try {
     //console.log(req.query)
     const userId =  req.query.id;
     //console.log(req)
     const user = await User.findById(userId).select("-password");
     //console.log({user})
     res.send(user);
   } catch (error) {
     console.error(error.message);
     res.status(500).send("Internal Server Error");
   }
 });
module.exports = router;