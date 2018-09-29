module.exports = function(sequelize, Sequelize) {

  var User = sequelize.define('user', {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    email: { type:Sequelize.STRING, allowNull: false, validate: {isEmail: true} },
    password: { type: Sequelize.STRING, allowNull: false },
    firstname: { type: Sequelize.STRING, notEmpty: true},
    lastname: { type: Sequelize.STRING, notEmpty: true},
    last_login: {type: Sequelize.DATE},
    status: {type: Sequelize.INTEGER(2), defaultValue:1}
  });

  return User;
}