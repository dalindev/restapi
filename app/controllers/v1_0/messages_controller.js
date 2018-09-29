var exports = module.exports = {}
const models = require("../../models");

exports.getMessages = function(req,res){

  const Messages = models.Messages;

  res.setHeader('Content-Type', 'application/json');

  // TODO - paging
  Messages.findAll({
    attributes: [
      'id',
      'user_id',
      'content',
      'createdAt',
      'User.first_name',
      'User.last_name'
    ],
    where: {
      status: 1
    },
    include: [{
      model: models.User,
      attributes: ['first_name','last_name']
    }]
  }).then( msgs => {
    // TODO - response helper
    res.status(200).send({
      "meta": {
        "result": true,
        "code": 200,
        "msg": "OK"
      },
      "data": msgs
    });
  }).catch( err => {
    console.log(err);
    // TODO - response helper
    res.status(404).send({
      "meta": {
        "result": false,
        "code": 404,
        "msg": 'Error: Can not get Messages'
      }
    });
  });
}

exports.postMessage = function(req,res){
  const Messages = models.Messages;

  res.status(200).send('looks ok to me...');
}

