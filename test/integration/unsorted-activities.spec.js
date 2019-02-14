const helper = require('./support/integrationSpecHelper');
const unsortedActivitiesPage = helper.unsortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Unsorted activities page', () => {
  const accountId = uuid.v4();

  describe('page outline', () => {
    it('should have correct title', () =>
      unsortedActivitiesPage.visit('c', accountId)
        .then(() => expect(unsortedActivitiesPage.browser.text('title'))
          .to.equal('Pick and sort your activities - Choose your activities'))
    );

    it('should contain valid google tag manager data', () =>
      unsortedActivitiesPage.visit('c', accountId)
        .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
    );
  });

  describe('activities list', () => {
    before(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity: helper.allActivities[0].name, category: 'READY' },
          { activity: helper.allActivities[17].name, category: 'NOT-SUITABLE' },
        ]))
        .then(() => unsortedActivitiesPage.visit('c', accountId))
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
      expect(unsortedActivitiesPage.activityList()[0].url).to.contain(
        `/c/${accountId}/activities/${helper.allActivities[1].name}/unsorted/categorise`)
    );
  });

  describe('activities list with categorised activity', () => {
    const activity = helper.allActivities[0];

    before(() =>
      helper.cleanDb()
        .then(() => helper.addSortedActivities(accountId, [
          { activity: activity.name, category: 'READY' },
        ]))
        .then(() => unsortedActivitiesPage.visit('c', accountId, activity))
    );

    it('should display an alert notifying the user that the activity has been sorted', () =>
      expect(unsortedActivitiesPage.alertMessage())
        .to.equal('You\'ve sorted ‘Find out about volunteering’.')
    );
  });


  describe('all activities sorted', () => {
    before(() =>
      helper.cleanDb()
        .then(() => helper.saveAllActivitiesAsSorted(accountId))
        .then(() => unsortedActivitiesPage.visit('c', accountId))
    );

    it('should display continue button', () =>
      expect(unsortedActivitiesPage.isContinueButtonDisplayed()).to.equal(true)
    );

    it('continue button should link to sorted page', () =>
      unsortedActivitiesPage.clickContinue()
        .then(() => helper.sortedActivitiesPage.expectAt('c', accountId))
    );
  });

  describe('cya-category-proto', () => {
    before(() =>
      helper.cleanDb()
    );

    it('Choose your activities - A', () =>
      unsortedActivitiesPage.visit('a', accountId, '')
        .then(() => {
          expect(unsortedActivitiesPage.browserPath())
            .to.contains(`/a/${accountId}/groups`);
          expect(unsortedActivitiesPage.browser.text('title')).to
            .equal('Pick and sort your activities - Choose your activities');
        })
    );

    it('should redirect the user to the default version if an invalid version is specified', () =>
      unsortedActivitiesPage.visit('d', accountId, '')
        .then(() => {
          const activityList = unsortedActivitiesPage.activityList();
          for (let i = 0; i < activityList.length; ++i) {
            const activity = activityList[i];
            expect(activity.url).to.contains(
              `/c/${accountId}/activities/${helper.allActivities[i].name}/unsorted/categorise`);
          }
        })
    );

    it('should redirect the user to the default version if no version is specified', () =>
      unsortedActivitiesPage.visitWithoutVersion(accountId, '')
        .then(() => {
          const activityList = unsortedActivitiesPage.activityList();
          for (let i = 0; i < activityList.length; ++i) {
            const activity = activityList[i];
            expect(activity.url).to.contains(
              `/c/${accountId}/activities/${helper.allActivities[i].name}/unsorted/categorise`);
          }
        })
    );
  });
});
