const db = require('../db');

module.exports = db.Model.extend(
  {
    tableName: 'sorted_activity',
    hasTimestamps: true,
  },
  {
    findAllByAccountId(accountId) {
      const query = this.forge().query({ where: { accountId } });
      return query.fetchAll().then((queryResult) => queryResult.serialize());
    },
  }
);
