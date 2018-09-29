var listMessagesCtrl = require('../../controllers/v1_0/messages_controller.js');

module.exports = function(app){

  app.get('/api/v1/listmessages', listMessagesCtrl.list);

  /*
    Functions
  */
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/login');
  }
}
