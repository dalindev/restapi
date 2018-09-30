"use strict";

const emojiStrip = require('emoji-strip');
var exports = module.exports = {};


exports.okResp = function(
  res,
  statusCode,
  msg=null,
  data=null,
  limit=null,
  page=null,
) {
  let total = 0;
  if (data) {
    total = data instanceof Array ? data.length :
      (data instanceof Object && Object.keys(data).length > 0 ? 1 : 0);
  }
  return res.status(statusCode).send({
    "meta": {
      "result": true,
      "code": statusCode,
      "total": total,
      "pagination": {
        "limit": limit,
        "page": page
      },
      "msg": msg
    },
    "data": data
  });
};


exports.errResp = function(
  res,
  statusCode,
  msg=null
) {
  return res.status(statusCode).send({
    "meta": {
      "result": false,
      "code": statusCode,
      "msg": msg
    }
  });
};


exports.isPalindrome = function(s='ab') {
  let tmp = emojiStrip(s).toLowerCase().replace(/[^a-zA-Z0-9]+/g, "").split("");
  let lo = 0;
  let hi = tmp.length-1;

  while (lo < hi) {
      if (tmp[lo] === tmp[hi]) {
          lo++;
          hi--;
      } else {
          return false;
      }
  }

  return true;
}


exports.deepGet = function(obj, prop) {
  if (obj === undefined || obj === null) {
      return;
  }

  // var found!
  if (prop.length === 0) {
      return obj;
  }

  let foundSoFar = obj[prop[0]];
  let remainingProp = prop.slice(1);

  return exports.deepGet(foundSoFar, remainingProp);
}

