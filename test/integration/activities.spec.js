const helper = require('./support/integrationSpecHelper');
const activitiesPage = helper.activitiesPage;
const chosenActivitiesPage = helper.chosenActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

const sortActivityAtIndex = (index, category) =>
  ({ activity: helper.allActivities[index].name, category });

describe('Activities page', () => {
  const accountId = uuid.v4();
  const group = 'GRP-1';

  ['a', 'b'].forEach(version => {
    describe(`page outline for version ${version}`, () => {
      before(() =>
        helper.cleanDb().then(() => activitiesPage.visit(version, accountId, group))
      );

      it('should have correct title', () =>
        expect(activitiesPage.browser.text('title')).to.equal('Choose your activities')
      );

      it('should contain valid google tag manager data', () =>
        expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
      );

      it('should have back button', () =>
        expect(activitiesPage.backButtonDisplayed()).to.equal(true)
      );
    });

    describe(`activities list for version ${version}`, () => {
      before(() =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            sortActivityAtIndex(6, 'READY'),
            sortActivityAtIndex(10, 'HELP'),
          ]))
          .then(() => activitiesPage.visit(version, accountId, group))
      );

      it('should display correct number of unsorted activities', () =>
        expect(activitiesPage.unCategorisedActivitiesList().length).to.equal(3)
      );

      describe('all activities are sorted', () => {
        before(() =>
          helper.addSortedActivities(accountId, [
            sortActivityAtIndex(2, 'HELP'),
            sortActivityAtIndex(7, 'HELP'),
            sortActivityAtIndex(8, 'READY'),
          ]).then(() => activitiesPage.visit(version, accountId, group))
        );

        it('should redirect to the chosen activities page if all activities are sorted', () =>
          expect(chosenActivitiesPage.getHeading().headingText).to.eql('Your chosen activities')
        );
      });

      it('should display correct title for unsorted activities', () => {
        const activitiesList = activitiesPage.unCategorisedActivitiesList();
        expect(activitiesList[0].title).to.equal(helper.allActivities[8].title);
        expect(activitiesList[1].title).to.equal(helper.allActivities[7].title);
        expect(activitiesList[2].title).to.equal(helper.allActivities[2].title);
      });

      it('should have correct url for activity', () =>
        expect(activitiesPage.unCategorisedActivitiesList()[0].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[8].name}/categorise`)
      );
    });

    describe(`smart answers for version ${version}`, () => {
      beforeEach(() =>
        helper.cleanDb()
          .then(() => helper.addSortedActivities(accountId, [
            // for group GRP-1
            sortActivityAtIndex(6, 'READY'),
            sortActivityAtIndex(10, 'HELP'),
            // for group GRP-2
            sortActivityAtIndex(9, 'READY'),
            sortActivityAtIndex(18, 'HELP'),
          ]))
          .then(() => activitiesPage.visit(version, accountId, group))
      );

      it('should display all the categorised activities in smart answers section', () => {
        const categorisedActivitiesList = activitiesPage.categorisedActivitiesList();
        expect(categorisedActivitiesList.length).to.equal(2);
        expect(categorisedActivitiesList[0].title).to.equal(helper.allActivities[6].title);
        expect(categorisedActivitiesList[1].title).to.equal(helper.allActivities[10].title);
      });

      it('should have correct url for categorised activity', () => {
        expect(activitiesPage.categorisedActivitiesList()[0].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[6].name}/categorise`);

        expect(activitiesPage.categorisedActivitiesList()[1].href).to
          .contain(
            // eslint-disable-next-line max-len
            `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[10].name}/categorise`);
      });

      [
        { activityName: helper.allActivities[6].name, category: 'READY' },
        { activityName: helper.allActivities[10].name, category: 'HELP' },
      ].forEach((scenario) => {
        it(`should list ${scenario.activityName} under ${scenario.category} category`, () =>
          expect(activitiesPage.isActivityUnderCategoryDisplayed(scenario.category,
            scenario.activityName)).to.be.true
        );
      });

      it('clicking "Start again" should un-categorise all activities in the current group', () =>
        activitiesPage.clickStartAgain().then(() => {
          expect(activitiesPage.categorisedActivitiesList().length).to.equal(0);
          expect(activitiesPage.unCategorisedActivitiesList().length).to.equal(5);
        })
      );

      it('clicking "Start again" should not affect categorisation in other groups', () =>
        activitiesPage.visit(version, accountId, group)
          .then(() => activitiesPage.clickStartAgain()
            .then(() => activitiesPage.visit(version, accountId, 'GRP-2')
              .then(() => expect(activitiesPage.categorisedActivitiesList().length).to.equal(2)))));
    });
  });
});
