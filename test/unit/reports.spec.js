const chai = require('chai');
const expect = chai.expect;

const knex = require('../../app/db').knex;
const reports = require('../../db/reports.js');

const ACCOUNT_ID_FROM_SEED = 'b4be6ba8-fdb0-11e6-b9d4-539e556f06e1';

describe('Reports', function () {
  describe('Metrics', function () {
    before(function () {
      return knex.seed.run({ directory: './db/seeds/all-activities-sorted' });
    });

    it('should return total number of sorted activities per account', function (done) {
      reports.getTotalSortedActivitiesCsv(ACCOUNT_ID_FROM_SEED)
        .then((result) => {
          expect(result).to.contain(`interventionRef,totalSorted\n${ACCOUNT_ID_FROM_SEED},19\n`);
          done();
        });
    });
  });
});
