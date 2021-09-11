const db = require("../models");
const config = require("../config/auth.config");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { Router } = require("express");

exports.googleLogin = (req, response) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then((res) => {
      const { email_verified, name, email } = res.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          } else {
            if (user) {
              var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, //24hours
              });
              response.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: token,
              });
            } else {
              let password = email + config.secret;
              const newUser = new User({ username: name, email, password });
              newUser.save((err, user) => {
                if (err) {
                  response.status(500).send({ message: err });
                  return;
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                  expiresIn: 86400, //24hours
                });
                response.status(200).send({
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  accessToken: token,
                });
              });
            }
          }
        });
      }
    });
};

exports.verifyExpiry = (req, res) => {
  Router.post("/verifyExpiry", (req, res) => {
    const token = req.body.token;
    jwt.verify(token, "secret", function (err, decoded) {
      if (err) {
        console.log(err);
      }
      console.log(decoded); // bar
    });
  });
};
