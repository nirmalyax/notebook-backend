const toMongo = require("./database");
const express = require("express");
toMongo();
const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Hello Nirmalya!");
});

app.listen(port, () => {
  console.log(`Example app listening on port "http://localhost:${port}"`);
});

