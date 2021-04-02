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

let users = [];
app.use("/stream", login, async (req, res) => {});
app.use("/listen/", (req, res) => {});
app.use("/listen/:sid", login, async (req, res) => {});

/**
 * the streamer makes a link and then shares it with fans
 *
 * fans get link, click it and they are suddenly listening to the right stuff
 */

console.log(
  "Options: " +
    "stream listen"
      .split(" ")
      .map((s) => "http://localhost:5000/" + s)
      .join("\n")
);
app.listen(5000);
