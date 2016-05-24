module.exports = function (db, DataTypes) {
  var Credential = db.define('credential', {
    custcode: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    login: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: false
    }
  });
  return Credential;
};
