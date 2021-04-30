const express = require("express");

const auth = require("./auth");
const { join } = require("path");
const [get, put, post, del] = require("./utils").http;
var redirect_uri = "http://localhost:5000/callback"; // Your redirect uri

const { app, login } = auth(redirect_uri);

const playUrl = `https://api.spotify.com/v1/me/player/play`;
const meUrl = "https://api.spotify.com/v1/me";
const streamerUrl = (sid) => `https://api.spotify.com/v1/${sid}/player`;

let users = [];
// this is where a streamer goes to register what they're listening to
app.use("/stream", login, async (req, res) => {
  get({ token: req.token, url: meUrl }).then((val) => res.send(val));
  // res.send({ token: req.token, body: req.body });
});

// here is where a listener goes to see all the different streamers available
app.use("/listen/", (req, res) => {
  res.send(req.body);
});

// this is where a listener goes when they want to listen to a particular streamer's stream
app.use("/listen/:sid", login, async (req, res) => {
  res.send(req.body);
});

console.log(
  "Options: " +
    "stream listen"
      .split(" ")
      .map((s) => "http://localhost:5000/" + s)
      .join("\n")
);
app.listen(5000);
