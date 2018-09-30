'use strict';

const emojiStrip = require('emoji-strip');


exports.okResp = function(
  res,
  statusCode,
  msg=null,
  data=null,
  searchTerm={}
) {
  let total = 0;
  if (data) {
    total = data instanceof Array ? data.length :
      (data instanceof Object && Object.keys(data).length > 0 ? 1 : 0);
  }
  return res.status(200).send({
    'meta': {
      'error': false,
      'code': statusCode,
      'total': total,
      'applied_filter': searchTerm,
      'msg': msg,
    },
    'data': data,
  });
};


exports.errResp = function(
  res,
  statusCode,
  msg=null
) {
  return res.status(200).send({
    'meta': {
      'error': true,
      'code': statusCode,
      'msg': msg,
    },
  });
};


exports.isPalindrome = function(s='ab') {
  let tmp = emojiStrip(s).toLowerCase().replace(/[^a-zA-Z0-9]+/g, '').split('');
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
};


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
};

