const helper = require('./support/integrationSpecHelper');
const unsortedActivitiesPage = helper.unsortedActivitiesPage;
const activities = require('../../app/models/activities');

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Unsorted activities page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    it('should have correct title', () =>
      unsortedActivitiesPage.visit(accountId)
        .then(() => expect(unsortedActivitiesPage.browser.text('title'))
          .to.equal('Sort these activities'))
    );
  });

  describe('activities', () => {
    it('should display unsorted activities', () =>
      helper.cleanDb()
        .then(() => helper.addSortedActivity(accountId, 'ACT-1', 'READY'))
        .then(() => helper.addSortedActivity(accountId, 'ACT-20', 'NO'))
        .then(() => unsortedActivitiesPage.visit(accountId))
        .then(() => expect(unsortedActivitiesPage.activityList().length)
          .to.equal(activities.length - 2))
    );
  });
});
