'use strict';

const models = require('../../models');
const helper = require('../../tools/helper_method');


/**
 * Get messages (option: search terms)
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.getMessages = function(req, res) {
  const Messages = models.Messages;

  // Can easily add search param in the future
  // requested filter
  const reqq = req.query || {};
  // applied filter
  const rqq = {};

  // Search term
  rqq.limit = reqq.limit !== undefined &&
                Number.isInteger(+reqq.limit) &&
                +reqq.limit > -1 ? +reqq.limit : 1000;

  rqq.order = reqq.order !== undefined &&
                ['ASC', 'DESC'].indexOf(reqq.order.toUpperCase()) > -1
    ? reqq.order.toUpperCase() : 'ASC';

  rqq.offset = reqq.offset !== undefined &&
                Number.isInteger(+reqq.offset) &&
                +reqq.offset > -1 ? +reqq.offset : 0;

  // TODO - rate limit (DDOS)
  Messages.findAll({
    offset: rqq.offset,
    limit: rqq.limit,
    order: [
      ['id', rqq.order],
    ],
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name',
      'palindrome',
    ],
    where: {
      status: 1,
    },
    include: [{
      model: models.User,
      attributes: ['first_name', 'last_name'],
    }],
  }).then( (resData) => {
    // OK
    helper.okResp(res, 200, 'ok', resData, rqq);
  }).catch( (err) => {
    console.log(err);
    // Error
    helper.errResp(res, 404, 'Error: Can not get Messages!');
  });
};


/**
 * Get one message with id
 *
 * @param {object} req The request
 * @param {object} res The response
 * @return {json}
 */
exports.getOneMessage = function(req, res) {
  const Messages = models.Messages;
  const getOneMsgId = req.params && +req.params.id ? +req.params.id : null;
  const whereClause = {status: 1};

  if (!Number.isInteger(getOneMsgId) || getOneMsgId < 1 ) {
    // Error, wrong id
    return helper.okResp(
      res, 400, 'Error: Message id should be interger and greater than 0'
    );
  }

  whereClause.id = getOneMsgId;

  // TODO - rate limit
  Messages.findOne({
    order: [
      ['id', 'ASC'],
    ],
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name',
      'palindrome',
    ],
    where: whereClause,
    include: [{
      model: models.User,
      attributes: ['first_name', 'last_name'],
    }],
  }).then( (resData) => {
    if (!resData) {
      // Can't find it
      helper.okResp(res, 404, 'Message does not exsits');
    } else {
      // edge case - palindrome == null
      if (helper.deepGet(
        resData, ['dataValues', 'palindrome'], null) == null
      ) {
        resData.dataValues.palindrome = helper.isPalindrome(
          helper.deepGet(resData, ['dataValues', 'content'], null)
        );

        Messages.update({
          palindrome: resData.dataValues.palindrome,
        }, {
          where: {
            id: getOneMsgId,
          },
        });
      }
      // OK
      return helper.okResp(res, 200, 'OK', resData);
    }
  }).catch( (err) => {
    console.log(err);
    // Error
    helper.errResp(res, 404, 'Error: Can not get Messages!');
  });
};


/**
 * Delete one message with id
 *
 * @param {object} req The request
 * @param {object} res The response
 * @return {json}
 */
exports.deleteOneMessage = function(req, res) {
  const Messages = models.Messages;
  const delOneMsgId = req.params && +req.params.id ? +req.params.id : null;

  if (!Number.isInteger(delOneMsgId) || delOneMsgId < 1 ) {
    return helper.okResp(
      res, 400, 'Error: Message id should be interger and greater than 0'
    );
  }

  Messages.findOne({
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name',
      'palindrome',
    ],
    where: {
      id: delOneMsgId,
      status: 1,
    },
    include: [{
      model: models.User,
      attributes: ['first_name', 'last_name'],
    }],
  }).then( (msg) => {
    // Can not find msg
    if (!msg) {
      helper.okResp(res, 404, 'Message dos not exsits');
    } else {
      let msgUserId = helper.deepGet(msg, ['dataValues', 'user_id'], null);
      let reqUserId = helper.deepGet(req, ['user', 'id'], null);

      if (msgUserId === reqUserId) {
        // OK, message deleted
        msg.update({status: 0});
        return helper.okResp(res, 204,
          'The message was successfully deleted', msg);
      } else {
        // Unauthorized, Not msg owner
        helper.okResp(res, 401, 'Unauthorized');
      }
    }
  }).catch( (err) => {
    // Error
    console.log(err);
    helper.errResp(res, 404, 'Error: Can not delete Messages!');
  });
};


/**
 * Post one message
 *
 * @param {object} req The request
 * @param {object} res The response
 */
exports.postMessage = function(req, res) {
  const Messages = models.Messages;

  // TODO - 413 Payload Too Large
  // - content size limit

  if (req.body && req.body.data && req.body.data.message) {
    // precalculation
    let isPalin = helper.isPalindrome(req.body.data.message) || false;

    Messages.create({
      user_id: req.user.id,
      content: req.body.data.message,
      palindrome: isPalin,
    }).then( (data) => {
      // OK, created
      helper.okResp(res, 201, 'Created', data);
    }).catch( (err) => {
      console.log(err);
      // Error
      helper.errResp(res, 404, 'Error: Can not post your message!');
    });
  } else {
    helper.errResp(res, 400,
      'Error: bad request, check your payload or URL!');
  }
};

