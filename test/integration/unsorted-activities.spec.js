const helper = require('./support/integrationSpecHelper');
const unsortedActivitiesPage = helper.unsortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Unsorted activities page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    it('should have correct title', () =>
      unsortedActivitiesPage.visit(accountId)
        .then(() => expect(unsortedActivitiesPage.browser.text('title'))
          .to.equal('Choose some activities'))
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
          { activity: helper.allActivities[0].name, category: 'READY' },
          { activity: helper.allActivities[17].name, category: 'NO' },
        ]))
        .then(() => unsortedActivitiesPage.visit(accountId))
    );

    it('should display correct number of unsorted activities', () =>
      expect(unsortedActivitiesPage.activityList().length)
        .to.equal(helper.allActivities.length - 2)
    );

    it('should display correct title for activity', () => {
      expect(unsortedActivitiesPage.activityList()[0].title)
        .to.equal(helper.allActivities[1].title);
      expect(unsortedActivitiesPage.activityList()[1].title)
        .to.equal(helper.allActivities[2].title);
    });

    it('should have correct url for activity', () =>
      expect(unsortedActivitiesPage.activityList()[0].url)
        .to.contain(`${accountId}/activities/${helper.allActivities[1].name}/categorise`)
    );
  });

  describe('activities list with categorised activity', () => {
    const activity = helper.allActivities[0];

    before(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity: activity.name, category: 'READY' },
        ]))
        .then(() => unsortedActivitiesPage.visit(accountId, activity))
    );

    it('should slide out sorted activity', () =>
      expect(unsortedActivitiesPage.isActivityMarkedToSlide(activity)).to.be.true
    );

    it('should not slide out unsorted activity', () =>
      expect(unsortedActivitiesPage.isActivityMarkedToSlide(helper.allActivities[4])).to.be.false
    );

    it('sorted activity should keep order', () =>
      expect(unsortedActivitiesPage.activityList()[0].title).to.equal(activity.title)
    );
  });
});
