var exports = module.exports = {}
const models = require("../../models");

exports.list = function(req,res){

  const Messages = models.messages;

  res.setHeader('Content-Type', 'application/json');

  Messages.findAll({
    where: {
      status: 1
    }
  }).then( msgs => {
    res.send(msgs);
  });

}

