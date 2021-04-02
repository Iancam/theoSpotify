const request = require("request");
const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const { generateRandomString } = require("./utils");
require("dotenv").config();
var app = express();
var { client_id, client_secret } = process.env;

const stateKey = "spotify_auth_state";
const scope =
  "user-read-private user-read-email user-modify-playback-state user-read-playback-state";

module.exports = (redirect_uri) => {
  app
    .use(express.static(__dirname + "/public"))
    .use(cors())
    .use(cookieParser());

  function login(req, res, next) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.cookie("next", req.baseUrl);

    // your application requests authorization
    console.log(req.query, req.baseUrl);
    if (req?.query.token) {
      req.token = req.query.token;
      req.query = undefined;
      next();
    } else {
      res.redirect(
        "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id,
            scope,
            redirect_uri,
            state,
          })
      );
    }
  }

  function callback(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    const nextUrl = req.cookies.next;
    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch",
          })
      );
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        },
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
        json: true,
      };

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          req.body = { token: body.access_token };
          res.cookie.token = body.access_token;

          res.redirect(
            nextUrl + "?" + querystring.stringify({ token: body.access_token })
          );
        } else {
          res.redirect(
            "/#" +
              querystring.stringify({
                error: "invalid_token",
              })
          );
        }
      });
    }
  }

  function refresh_token(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          access_token,
        });
      }
    });
  }
  const loginTo = (url, end) => {
    app.use("/callback", callback, end);
  };
  app.use("/login", login);
  app.use("/callback", callback);
  app.use("/refresh_token", refresh_token);
  return { app, login, callback, refresh_token };
};
