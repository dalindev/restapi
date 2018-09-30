var listMessagesCtrl = require('../../controllers/v1_0/messages_controller.js');

module.exports = function(app){

  // get messages
  app.get('/api/v1/messages', listMessagesCtrl.getMessages);

  // get one message by id
  app.get('/api/v1/messages/:id', listMessagesCtrl.getOneMessage);

  // delete one message
  // app.delete('/api/v1/messages/:id', isLoggedIn, listMessagesCtrl.deleteOneMessage);

  // post one message
  app.post('/api/v1/message', isLoggedIn, listMessagesCtrl.postMessage);

  /*
    Functions
  */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    } else {
      res.status(401).send({
        "meta": {
          "result": false,
          "code": 401,
          "msg": 'Unauthorized: login is required'
        }
      })
    }
  }
}
