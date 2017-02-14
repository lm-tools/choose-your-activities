const helper = require('./support/integrationSpecHelper');
const allActivites = helper.allActivities;
const sortedActivitiesPage = helper.sortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Sorted activities page', () => {
  const accountId = uuid.v4();

  beforeEach(() =>
    helper.cleanDb()
      .then(() => sortedActivitiesPage.visit(accountId))
  );

  describe('page outline', () => {
    it('should have correct title', () =>
      expect(sortedActivitiesPage.browser.text('title'))
        .to.equal('Choose your activities')
    );

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal(accountId)
    );

    helper.categories.map(x => x.title).forEach(s => {
      it(`should display category header "${s}"`, () =>
        expect(sortedActivitiesPage.activityCategories()).to.include(s)
      );
    });
  });

  describe('empty state', () => {
    it('should not display any activities', () =>
      expect(sortedActivitiesPage.activityList().length).to.equal(0)
    );

    it('should show navigation', () => {
      expect(sortedActivitiesPage.isNavigationDisplayed()).to.equal(true);
    });

    helper.categories.filter(x => x.collapsed).forEach(category => {
      it(`should show empty message for "${category.name}" category`, () =>
        expect(sortedActivitiesPage.getCategoryDescription(category.name))
          .to.equal("You haven't chosen anything for this.")
      );
    });
  });

  describe('already sorted activities', () => {
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
        { activity: allActivites[17].name, category: 'NO' },
      ])
        .then(() => sortedActivitiesPage.visit(accountId))
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
        expectedActivitiesTitles: [allActivites[15].title, allActivites[17].title],
      },
    ].forEach(s => {
      it(`should display list of activities in "${s.category}" category`, () =>
        expect(sortedActivitiesPage.getActivitiesInCategory(s.category))
          .to.eql(s.expectedActivitiesTitles)
      );

      it(`should not display empty message for "${s.category}" category`, () =>
        expect(sortedActivitiesPage.getCategoryDescription(s.category)).to.be.empty
      );
    });

    ['DOING', 'NO', 'NOT-WORKED'].forEach((category) => {
      it(`should hide less relevant activities for category ${category}`, () =>
        expect(sortedActivitiesPage.getOpenCategory(category)).not.to.exist
      );
    });

    it('should link to activity details', () =>
      sortedActivitiesPage.clickDetailsButton(allActivites[0]).then(() =>
        expect(helper.activityDetailsPage.browserPath())
          .to.contain(`${accountId}/activities/${allActivites[0].name}`)
      )
    );

    it('should link to re-sort activity', () =>
      sortedActivitiesPage.clickReSortActivitiesLink().then(() =>
        expect(helper.activityDetailsPage.browserPath())
          .to.contain(`${accountId}/activities/sorted/resort`)
      )
    );

    it('should display the number of hidden activities when only one is hidden', () => {
      expect(sortedActivitiesPage.getCategorySummary('NOT-WORKED')).to.equal('Show 1 activity');
    });

    it('should display the number of hidden activities when there are many hidden', () => {
      expect(sortedActivitiesPage.getCategorySummary('NO')).to.equal('Show 2 activities');
    });


    [
      {
        category: 'READY', activity: allActivites[0],
      },
      {
        category: 'DOING', activity: allActivites[2],
      },
      {
        category: 'HELP', activity: allActivites[10],
      },
      {
        category: 'NOT-WORKED', activity: allActivites[7],
      },
      {
        category: 'NO', activity: allActivites[17],
      },
    ].forEach(s => {
      it(`should not display "Move" link for activity in category "${s.category}"`, () =>
        expect(sortedActivitiesPage.isMoveButtonDisplayed(s.activity)).to.equal(false)
      );

      it(`should link to resort page from details page for activity in ${s.category}`, () =>
        sortedActivitiesPage.clickDetailsButton(s.activity)
          .then(() => helper.activityDetailsPage.clickBackButton())
          .then(() => sortedActivitiesPage.expectAt(accountId))
      );
    });

    ['DOING', 'NOT-WORKED', 'NO'].forEach(s => {
      it(`should expand category "${s}" by default`, () =>
        expect(sortedActivitiesPage.isCategoryExpanded(s)).to.equal(false)
      );
    });

    it('should show navigation', () => {
      expect(sortedActivitiesPage.isNavigationDisplayed()).to.equal(true);
    });
  });

  describe('all activities sorted', () => {
    beforeEach(() =>
      helper.cleanDb()
        .then(() => helper.saveAllActivitiesAsSorted(accountId))
        .then(() => sortedActivitiesPage.visit(accountId))
    );

    it('should hide navigation', () => {
      expect(sortedActivitiesPage.isNavigationDisplayed()).to.equal(false);
    });
  });
});
