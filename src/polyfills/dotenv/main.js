"use strict";
var fs = require("fs"),
    path = require("path");function parse(a) {
  var d = {};return a.toString().split("\n").forEach(function (a) {
    var e = a.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);if (null != e) {
      var f = e[1];var b = e[2] || "";var _a = b ? b.length : 0;0 < _a && "\"" === b.charAt(0) && "\"" === b.charAt(_a - 1) && (b = b.replace(/\\n/gm, "\n")), b = b.replace(/(^['"]|['"]$)/g, "").trim(), d[f] = b;
    }
  }), d;
}function config(a) {
  var d = path.resolve(process.cwd(), ".env"),
      e = "utf8";a && (a.path && (d = a.path), a.encoding && (e = a.encoding));try {
    var b = parse(fs.readFileSync(d, { encoding: e }));return Object.keys(b).forEach(function (c) {
      process.env.hasOwnProperty(c) || (process.env[c] = b[c]);
    }), { parsed: b };
  } catch (a) {
    return { error: a };
  }
}module.exports.config = config, module.exports.load = config, module.exports.parse = parse;