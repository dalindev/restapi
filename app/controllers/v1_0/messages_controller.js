"use strict";

var exports = module.exports = {}
var emojiStrip = require('emoji-strip');
const models = require("../../models");

exports.errResponse = function(res, result, errCode, msg=null, data=null) {
  return res.status(errCode).send({
    "meta": {
      "result": result,
      "code": errCode,
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

  res.setHeader('Content-Type', 'application/json');

  const getOneMsg = req.params && req.params.id ? req.params.id : null;

  const whereClause = {status: 1};
  if (getOneMsg) {
    if (!Number.isInteger(+req.params.id) || +req.params.id < 1 ) {
      return exports.errResponse(res, false, 400,
        'Error: Message id should be interger and greater than 0'
      );
    }
    whereClause.id = getOneMsg
  }

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
  }).then( msgs => {
    // edge case - palindrome == null
    if (getOneMsg &&
      msgs[0] &&
      msgs[0].dataValues &&
      msgs[0].dataValues.palindrome == null
    ) {
      // TODO - should update DB for this row since we calculated isPalindrome
      msgs[0].dataValues.palindrome = exports.isPalindrome(msgs[0].dataValues.content);
    }

    return exports.errResponse(res, true, 200, 'ok', msgs);
  }).catch( err => {
    console.log(err);
    return exports.errResponse(res, false, 404, 'Error: Can not get Messages!');
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
      return exports.errResponse(res, true, 201, 'Created', msg);
    }).catch( err => {
      console.log(err);
      return exports.errResponse(res, false, 400, 'Bad Request: Can not post your message!');
    });
  }
}

