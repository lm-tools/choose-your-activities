const helper = require('./support/integrationSpecHelper');
const allActivites = helper.allActivities;
const reSortActivitiesPage = helper.reSortActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Re-Sort activities page', () => {
  const accountId = uuid.v4();

  beforeEach(() =>
    helper.cleanDb()
      .then(() => reSortActivitiesPage.visit(accountId))
  );

  describe('Re-Sort page outline', () => {
    it('should have correct title', () =>
      expect(reSortActivitiesPage.browser.text('title'))
        .to.equal('Rearrange your list')
    );

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    helper.categories.map(x => x.title).forEach(s => {
      it(`should display category header "${s}"`, () =>
        expect(reSortActivitiesPage.activityCategories()).to.include(s)
      );
    });

    it('should link back to the sorted page from introduction text link', () =>
      reSortActivitiesPage.clickIntroductionLink()
        .then(() => expect(reSortActivitiesPage.browserPath())
          .to.contain(`${accountId}/activities/sorted`))
    );

    it('should link back to the sorted page from continue button', () =>
      reSortActivitiesPage.clickContinueButton()
        .then(() => expect(reSortActivitiesPage.browserPath())
          .to.contain(`${accountId}/activities/sorted`))
    );
  });

  describe('Re-Sort empty state', () => {
    it('should not display any activities', () =>
      expect(reSortActivitiesPage.activityList().length).to.equal(0)
    );

    helper.categories.filter(x => !x.collapsed).forEach(category => {
      it(`should show empty message for "${category.name}" category`, () =>
        expect(reSortActivitiesPage.getCategoryDescription(category.name))
          .to.equal('Nothing here yet')
      );
    });
  });

  describe('Re-Sort already sorted activities', () => {
    beforeEach(() =>
      helper.addSortedActivities(accountId, [
        { activity: allActivites[0].name, category: 'READY' },
        { activity: allActivites[1].name, category: 'READY' },
        { activity: allActivites[2].name, category: 'DOING' },
        { activity: allActivites[4].name, category: 'DOING' },
        { activity: allActivites[3].name, category: 'HELP' },
        { activity: allActivites[10].name, category: 'HELP' },
        { activity: allActivites[11].name, category: 'HELP' },
        { activity: allActivites[7].name, category: 'NOT-WORKED' },
        { activity: allActivites[15].name, category: 'NO' },
        { activity: allActivites[19].name, category: 'NO' },
      ])
        .then(() => reSortActivitiesPage.visit(accountId))
    );

    [
      {
        category: 'READY',
        expectedActivitiesTitles: [allActivites[0].title, allActivites[1].title],
      },
      {
        category: 'DOING',
        expectedActivitiesTitles: [allActivites[2].title, allActivites[4].title],
      },
      {
        category: 'HELP',
        expectedActivitiesTitles: [
          allActivites[3].title, allActivites[10].title, allActivites[11].title,
        ],
      },
      {
        category: 'NOT-WORKED',
        expectedActivitiesTitles: [allActivites[7].title],
      },
      {
        category: 'NO',
        expectedActivitiesTitles: [allActivites[15].title, allActivites[19].title],
      },
    ].forEach(s => {
      it(`should display list of activities in "${s.category}" category`, () =>
          expect(reSortActivitiesPage.getActivitiesInCategory(s.category))
            .to.eql(s.expectedActivitiesTitles)
      );

      it(`should not display empty message for "${s.category}" category`, () =>
        expect(reSortActivitiesPage.getCategoryDescription(s.category)).to.be.empty
      );
    });

    it('should link to categorise activity page for activity', () =>
      reSortActivitiesPage.clickCategoriseButton(allActivites[0]).then(() =>
        expect(helper.categoriseActivityPage.browserPath())
          .to.contain(`${accountId}/activities/${allActivites[0].name}/categorise`)
      )
    );
  });
});
