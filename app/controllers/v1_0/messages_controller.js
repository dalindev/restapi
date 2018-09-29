var exports = module.exports = {}
const models = require("../../models");

exports.list = function(req,res){

  const Messages = models.Messages;

  res.setHeader('Content-Type', 'application/json');

  console.log(models.User);

  Messages.findAll({
    where: {
      status: 1
    },
    include: [{
      model: models.User,
      attributes: ['first_name','last_name']
    }]
  }).then( msgs => {
    res.send(msgs);
  });

}

