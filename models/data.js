module.exports = function (db, DataTypes) {
  var Data = db.define('data', {
    action: DataTypes.JSON()
  });
  Data.sync();
  return Data;
}
