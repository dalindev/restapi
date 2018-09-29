module.exports = function(sequelize, Sequelize) {

  var Messages = sequelize.define('messages', {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    user_id: { type: Sequelize.INTEGER, allowNull: false},
    content: { type:Sequelize.TEXT},
    palindrome: { type: Sequelize.BOOLEAN, allowNull: true},
    status: {type: Sequelize.INTEGER(2), defaultValue:1}
  });

  return Messages;
}