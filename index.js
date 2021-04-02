const express = require("express");
const request = require("request");
const auth = require("./auth");
const { promisify } = require("util");
const { join } = require("path");

var redirect_uri = "http://localhost:5000/callback"; // Your redirect uri

const [get, put, post, del] = "get put post delete"
  .split(" ")
  .map((method) => (opts) =>
    promisify(request[method])({
      headers: { Authorization: "Bearer " + opts.token },
      json: true,
      ...opts,
    })
  );
const { app, login } = auth(redirect_uri);

const playUrl = `https://api.spotify.com/v1/me/player/play`;
const meUrl = "https://api.spotify.com/v1/me";
const streamerUrl = (sid) => `https://api.spotify.com/v1/${sid}/player`;

let users = [];
app.use("/stream", login, async (req, res) => {});
app.use("/listen/", (req, res) => {});
app.use("/listen/:sid", login, async (req, res) => {});

console.log(
  "Options: " +
    "stream listen"
      .split(" ")
      .map((s) => "http://localhost:5000/" + s)
      .join("\n")
);
app.listen(5000);
