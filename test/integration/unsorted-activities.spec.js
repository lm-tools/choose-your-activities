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

  describe('activities list', () => {
    before(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity: 'ACT-1', category: 'READY' },
          { activity: 'ACT-20', category: 'NO' },
        ]))
        .then(() => unsortedActivitiesPage.visit(accountId))
    );

    it('should display correct number of unsorted activities', () =>
      expect(unsortedActivitiesPage.activityList().length)
        .to.equal(activities.length - 2)
    );

    it('should display correct title for activity', () => {
      expect(unsortedActivitiesPage.activityList()[0].title).to.equal('Get some work experience');
      expect(unsortedActivitiesPage.activityList()[1].title).to.equal('Find a mentor');
    });

    it('should have correct url for activity', () =>
      expect(unsortedActivitiesPage.activityList()[0].url)
        .to.contain(`${accountId}/categorise-activity/ACT-2`)
    );
  });
});
