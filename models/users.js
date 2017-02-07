module.exports = function(sequelize, dataTypes) {
  return sequelize.define('users', {
    uid: {
      type: dataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: dataTypes.STRING,
      unique: true
    },
    password: {
      type: dataTypes.STRING
    },
    displayName: dataTypes.STRING,
    photoUrl: dataTypes.STRING,
    updatedAt: dataTypes.DATE,
    createdAt: dataTypes.DATE
  });
}
