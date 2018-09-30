"use strict";

var exports = module.exports = {};

const models = require("../../models");
const helper = require('../../tools/helper_method');


exports.getMessages = function(req,res) {
  const Messages = models.Messages;
  // Can easily add search param in the future
  const whereClause = {status: 1};

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
    // OK
    helper.okResp(res, 200, 'ok', resData)
  }).catch( err => {
    console.log(err);
    // Error
    helper.okResp(res, 404, 'Error: Can not get Messages!');
  });
}


exports.getOneMessage = function(req,res) {
  const Messages = models.Messages;
  const getOneMsgId = req.params && +req.params.id ? +req.params.id : null;
  const whereClause = {status: 1};

  if (!Number.isInteger(getOneMsgId) || getOneMsgId < 1 ) {
    // Error, wrong id
    helper.okResp(
      res, 400, 'Error: Message id should be interger and greater than 0'
    );
  } else {

    whereClause.id = getOneMsgId
    // TODO - rate limit
    // TODO - pagination limit/page (ex: 20/0 )
    // TODO - ondemand, ex: load msg after id 300
    Messages.findOne({
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
      if (!resData) {
        // Can't find it
        helper.okResp(res, 404, 'Message dos not exsits');
      } else {
        // edge case - palindrome == null
        if (helper.deepGet(resData, ["dataValues","palindrome"], null) == null) {
          resData.dataValues.palindrome = helper.isPalindrome(
            helper.deepGet(resData, ["dataValues","content"], null)
          );

          Messages.update({
            palindrome: resData.dataValues.palindrome
          }, {
            where: {
              id: getOneMsgId
            }
          });
        }
        // OK
        return helper.okResp(res, 200, 'OK', resData);
      }
    }).catch( err => {
      console.log(err);
      // Error
      helper.errResp(res, 404, 'Error: Can not get Messages!');
    });

  }
}


exports.deleteOneMessage = function(req,res) {
  const Messages = models.Messages;
  const delOneMsgId = req.params && +req.params.id ? +req.params.id : null;

  if (!Number.isInteger(delOneMsgId) || delOneMsgId < 1 ) {
    helper.okResp(
      res, 400, 'Error: Message id should be interger and greater than 0'
    );
  }

  Messages.findOne({
    where: {
      id: delOneMsgId,
      status: 1
    }
  }).then( msg => {
    // Can not find msg
    if (!msg) {
      helper.okResp(res, 404, 'Message dos not exsits');
    } else {
      let msg_user_id = helper.deepGet(msg, ["dataValues","user_id"], null);
      let req_user_id = helper.deepGet(req, ["user","id"], null);

      if (msg_user_id === req_user_id) {
        // OK, message deleted
        msg.update({status: 0});
        return helper.okResp(res, 204, 'The message was successfully deleted');
      } else {
        // Unauthorized, Not msg owner
        helper.okResp(res, 401, 'Unauthorized');
      }
    }
  }).catch( err => {
    // Error
    console.log(err);
    helper.errResp(res, 404, 'Error: Can not delete Messages!');
  });

}


exports.postMessage = function(req,res) {
  const Messages = models.Messages;

  // TODO - 413 Payload Too Large
  // - content size limit

  if (req.body && req.body.data && req.body.data.message) {

    // precalculation
    let isPalin = helper.isPalindrome(req.body.data.message) || false;

    Messages.create({
      user_id: req.user.id,
      content: req.body.data.message,
      palindrome: isPalin
    }).then( data => {
      // OK, created
      helper.okResp(res, 201, 'Created', data);
    }).catch( err => {
      console.log(err);
      // Error
      helper.errResp(res, 404, 'Error: Can not post your message!');
    });
  }
}

