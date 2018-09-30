var exports = module.exports = {}
const models = require("../../models");

exports.errResponse = function (res, result, errCode, msg='', data='') {
  return res.status(errCode).send({
    "meta": {
      "result": result,
      "code": errCode,
      "msg": msg
    },
    "data": data
  })
};

exports.getMessages = function(req,res){

  const Messages = models.Messages;

  res.setHeader('Content-Type', 'application/json');

  const whereClause = {status: 1};

  // TODO - pagination
  // TODO - ondemand, ex: load msg after id 300
  // TODO - sort
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
      'User.last_name'
    ],
    where: whereClause,
    include: [{
      model: models.User,
      attributes: ['first_name','last_name']
    }]
  }).then( msgs => {
    return exports.errResponse(res, true, 200, 'ok', msgs);
  }).catch( err => {
    console.log(err);
    return exports.errResponse(res, false, 404, 'Error: Can not get Messages!');
  });
}

exports.postMessage = function(req,res){
  const Messages = models.Messages;

  // 400 Bad Request
  // 413 Payload Too Large
  // TODO - content size limit

  if(req.body && req.body.data && req.body.data.message) {
    Messages.create({
      user_id: req.user.id,
      content: req.body.data.message,
    }).then(msg => {
      return exports.errResponse(res, true, 201, 'Created', msg);
    }).catch( err => {
      console.log(err);
      return exports.errResponse(res, false, 400, 'Bad Request: Can not post your message!');
    });
  }
}

