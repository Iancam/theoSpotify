const request = require("request");
const { promisify } = require("util");
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
module.exports.generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports.http = "get put post delete".split(" ").map((method) => (opts) =>
  promisify(request[method])({
    headers: { Authorization: "Bearer " + opts.token },
    json: true,
    ...opts,
  })
);
