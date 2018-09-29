module.exports = function(sequelize, Sequelize) {

  var Messages = sequelize.define('messages', {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    user_id: { type: Sequelize.INTEGER,allowNull: false},
    about: { type:Sequelize.TEXT},
    last_login: {type: Sequelize.DATE},
    status: {type: Sequelize.ENUM('active','inactive'),defaultValue:'active' }
  });

  sequelize.models.User.hasMany(Messages, {foreignKey: {name: 'user_id', allowNull: false }});

  return Messages;
}