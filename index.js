const toMongo = require("./database");
const express = require("express");

toMongo();
const app = express();
const port = 5001;

app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`App listening on port --> http://localhost:${port}`);
});
