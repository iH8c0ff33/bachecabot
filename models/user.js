module.exports = function (db, DataTypes) {
  var User = db.define('user', {
    id: {
      type: DataTypes.INTEGER(),
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    first_name: DataTypes.STRING(),
    last_name: DataTypes.STRING(),
    username: DataTypes.STRING()
  });
  User.sync();
  return User;
}
