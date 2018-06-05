const helper = require('./support/integrationSpecHelper');
const activitiesPage = helper.activitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;

const expect = require('chai').expect;
const uuid = require('uuid');

describe('Activities page', () => {
  const accountId = uuid.v4();
  const group = 'GRP-1';
  ['a', 'b']
    .forEach(version => {
      describe(`page outline for version ${version}`, () => {
        it('should have correct title', () =>
          activitiesPage.visit(version, accountId, group)
            .then(() => expect(activitiesPage.browser.text('title')).to
              .equal('Choose your activities'))
        );

        it('should contain valid google tag manager data', () =>
          activitiesPage.visit(version, accountId, group)
            .then(() => expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId))
        );

        it('should have back button', () =>
          expect(activitiesPage.backButtonDisplayed()).to.equal(true)
        );
      });
      describe(`activities list for version ${version}`, () => {
        before(() =>
          helper.cleanDb()
            .then(() => helper.addSortedActivities(accountId, [
              { activity: helper.allActivities[6].name, category: 'READY' },
              { activity: helper.allActivities[10].name, category: 'NO' },
            ]))
            .then(() => activitiesPage.visit(version, accountId, group))
        );

        it('should display correct number of unsorted activities', () =>
          expect(activitiesPage.actvitiesList().length).to.equal(3)
        );

        it('should display correct title for unsorted activities', () => {
          const actvitiesList = activitiesPage.actvitiesList();
          expect(actvitiesList[0].title).to.equal(helper.allActivities[8].title);
          expect(actvitiesList[1].title).to.equal(helper.allActivities[7].title);
          expect(actvitiesList[2].title).to.equal(helper.allActivities[2].title);
        });

        it('should have correct url for activity', () =>
          expect(activitiesPage.actvitiesList()[0].href).to
            .contain(
              // eslint-disable-next-line max-len
              `/${version}/${accountId}/groups/${group}/activities/${helper.allActivities[8].name}/categorise`)
        );

        it('should display the correct number of activities remaining', () =>
          expect(activitiesPage.actvitiesCount()).to.contain('3 activities you can do')
        );
      });
    });
});
