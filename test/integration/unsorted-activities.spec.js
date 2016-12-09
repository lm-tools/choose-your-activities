const helper = require('./support/integrationSpecHelper');
const unsortedActivitiesPage = helper.unsortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
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

    it('should contain valid google tag manager data', () =>
      unsortedActivitiesPage.visit(accountId)
        .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
    );
  });

  describe('activities', () => {
    it('should display unsorted activities', () =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity: 'ACT-1', category: 'READY' },
          { activity: 'ACT-20', category: 'NO' },
        ]))
        .then(() => unsortedActivitiesPage.visit(accountId))
        .then(() => expect(unsortedActivitiesPage.activityList().length)
          .to.equal(activities.length - 2))
    );
  });
});
