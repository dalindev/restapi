/* eslint-disable new-cap */
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    email: {
      type: DataTypes.STRING, allowNull: false, validate: {isEmail: true},
    },
    password: {type: DataTypes.STRING, allowNull: false},
    first_name: {type: DataTypes.STRING, notEmpty: true},
    last_name: {type: DataTypes.STRING, notEmpty: true},
    last_login: {type: DataTypes.DATE},
    status: {type: DataTypes.INTEGER(2), defaultValue: 1},
  });

  User.associate = function(models) {
    User.hasMany(models.Messages, {foreignKey: 'user_id'});
  };

  return User;
};
