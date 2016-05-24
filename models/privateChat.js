module.exports = function (db, DataTypes) {
  var PrivateChat = db.define('privateChat', {
    id: {
      type: DataTypes.INTEGER(),
      unique: true,
      allowNull: false,
      primaryKey: true
    }
  });
  return PrivateChat;
};
