const express = require("express");
const route = express.Router();
var dotenv = require("dotenv");
dotenv.config();

const api_key = process.env.MAILGUN_API;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

route.post("/", (req, res) => {
  console.log(req.body);
  const data = {
    from: req.body.from,
    to: req.body.to,
    // cc: req.body.cc,
    // bcc: req.body.bcc,
    subject: req.body.subject,
    text: req.body.body,
    template: "testing",
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.log("maingun err - ", error);
      return;
    }
    console.log(body);
  });
  res.json({ success: true });
});

module.exports = route;
