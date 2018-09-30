"use strict";

var exports = module.exports = {}
var emojiStrip = require('emoji-strip');
const models = require("../../models");


exports.resResponse = function(
  res,
  result,
  statusCode,
  msg=null,
  data=null
) {
  return res.status(statusCode).send({
    "meta": {
      "result": result,
      "total": data && data.length ? data.length : 0,
      "pagination": {
        "limit": null,
        "page": null
      },
      "code": statusCode,
      "msg": msg
    },
    "data": data
  })
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


exports.getMessages = function(req,res) {
  const Messages = models.Messages;
  // Can easily add search param in the future
  const whereClause = {status: 1};

  res.setHeader('Content-Type', 'application/json');
  // TODO - rate limit
  // TODO - pagination limit/page (ex: 20/0 )
  // TODO - ondemand, ex: load msg after id 300
  Messages.findAll({
    order: [
      ['id', 'ASC']
    ],
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name',
      'palindrome'
    ],
    where: whereClause,
    include: [{
      model: models.User,
      attributes: ['first_name','last_name']
    }]
  }).then( resData => {
    return exports.resResponse(res, true, 200, 'ok', resData);
  }).catch( err => {
    console.log(err);
    return exports.resResponse(res, false, 404, 'Error: Can not get Messages!');
  });
}


exports.getOneMessage = function(req,res) {
  const Messages = models.Messages;
  const getOneMsgId = req.params && +req.params.id ? +req.params.id : null;
  const whereClause = {status: 1};

  if (!Number.isInteger(getOneMsgId) || getOneMsgId < 1 ) {
    return exports.resResponse(res, false, 400,
      'Error: Message id should be interger and greater than 0'
    );
  }
  whereClause.id = getOneMsgId

  res.setHeader('Content-Type', 'application/json');
  // TODO - rate limit
  // TODO - pagination limit/page (ex: 20/0 )
  // TODO - ondemand, ex: load msg after id 300
  Messages.findAll({
    order: [
      ['id', 'ASC']
    ],
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name',
      'palindrome'
    ],
    where: whereClause,
    include: [{
      model: models.User,
      attributes: ['first_name','last_name']
    }]
  }).then( resData => {
    // edge case - palindrome == null
    if ( resData[0] &&
      resData[0].dataValues &&
      resData[0].dataValues.palindrome == null
    ) {
      // TODO - should update DB for this row since we calculated isPalindrome here
      // But this should be a very rare case
      resData[0].dataValues.palindrome = exports.isPalindrome(resData[0].dataValues.content);
    }
    return exports.resResponse(res, true, 200, 'ok', resData);
  }).catch( err => {
    console.log(err);
    return exports.resResponse(res, false, 404, 'Error: Can not get Messages!');
  });
}


exports.postMessage = function(req,res) {

  const Messages = models.Messages;

  // TODO - 413 Payload Too Large
  // - content size limit

  if (req.body && req.body.data && req.body.data.message) {

    // precalculation
    let isPalin = exports.isPalindrome(req.body.data.message) || false;

    Messages.create({
      user_id: req.user.id,
      content: req.body.data.message,
      palindrome: isPalin
    }).then( msg => {
      return exports.resResponse(res, true, 201, 'Created', msg);
    }).catch( err => {
      console.log(err);
      return exports.resResponse(res, false, 400, 'Bad Request: Can not post your message!');
    });
  }
}

