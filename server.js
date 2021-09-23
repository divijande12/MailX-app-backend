const express = require("express");
const cors = require("cors");
const app = express();
var dotenv = require("dotenv");
dotenv.config();

var corOptions = {
  origin: true,
};

app.use(cors(corOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
const db = require("./models");
const { url } = require("./config/db.config");

db.mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database", err);
    process.exit();
  });

require("./routes/auth.routes")(app);
app.use("/send-mail", require("./routes/send_email.routes"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MailX Server !!!!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});
