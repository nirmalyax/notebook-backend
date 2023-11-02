const express = require("express");
const Users = require("../models/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/createnewuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
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
      user = await Users.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      res.json({ Database: "Updated" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error");
    }
  }
);

module.exports = router;
