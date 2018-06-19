const helper = require('./support/integrationSpecHelper');
const allActivities = helper.allActivities;
const sortedActivitiesPage = helper.sortedActivitiesPage;
const googleTagManagerHelper = helper.googleTagManagerHelper;
const expect = require('chai').expect;
const uuid = require('uuid');

describe('Sorted activities page', () => {
  const accountId = uuid.v4();

  beforeEach(() =>
    helper.cleanDb()
      .then(() => sortedActivitiesPage.visit('c', accountId))
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
        { activity: allActivities[0].name, category: 'READY' },
        { activity: allActivities[1].name, category: 'READY' },
        { activity: allActivities[2].name, category: 'DOING' },
        { activity: allActivities[4].name, category: 'DOING' },
        { activity: allActivities[3].name, category: 'HELP' },
        { activity: allActivities[10].name, category: 'HELP' },
        { activity: allActivities[11].name, category: 'HELP' },
        { activity: allActivities[7].name, category: 'NOT-WORKED' },
        { activity: allActivities[15].name, category: 'NO' },
        { activity: allActivities[17].name, category: 'NO' },
      ])
        .then(() => sortedActivitiesPage.visit('c', accountId))
    );

    [
      {
        category: 'READY',
        expectedActivitiesTitles: [allActivities[0].title, allActivities[1].title],
      },
      {
        category: 'DOING',
        expectedActivitiesTitles: [allActivities[2].title, allActivities[4].title],
      },
      {
        category: 'HELP',
        expectedActivitiesTitles: [
          allActivities[3].title, allActivities[10].title, allActivities[11].title,
        ],
      },
      {
        category: 'NOT-WORKED',
        expectedActivitiesTitles: [allActivities[7].title],
      },
      {
        category: 'NO',
        expectedActivitiesTitles: [allActivities[15].title, allActivities[17].title],
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
      sortedActivitiesPage.clickDetailsButton(allActivities[0]).then(() =>
        expect(helper.activityDetailsPage.browserPath())
          .to.contain(`c/${accountId}/activities/${allActivities[0].name}`)
      )
    );

    it('should link to re-sort activity', () =>
      sortedActivitiesPage.clickReSortActivitiesLink().then(() =>
        expect(helper.activityDetailsPage.browserPath())
          .to.contain(`c/${accountId}/activities/sorted/resort`)
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
        category: 'READY', activity: allActivities[0],
      },
      {
        category: 'DOING', activity: allActivities[2],
      },
      {
        category: 'HELP', activity: allActivities[10],
      },
      {
        category: 'NOT-WORKED', activity: allActivities[7],
      },
      {
        category: 'NO', activity: allActivities[17],
      },
    ].forEach(s => {
      it(`should not display "Move" link for activity in category "${s.category}"`, () =>
        expect(sortedActivitiesPage.isMoveButtonDisplayed(s.activity)).to.equal(false)
      );

      it(`should link to resort page from details page for activity in ${s.category}`, () =>
        sortedActivitiesPage.clickDetailsButton(s.activity)
          .then(() => helper.activityDetailsPage.clickBackButton())
          .then(() => sortedActivitiesPage.expectAt('c', accountId))
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
        .then(() => sortedActivitiesPage.visit('c', accountId))
    );

    it('should hide navigation', () => {
      expect(sortedActivitiesPage.isNavigationDisplayed()).to.equal(false);
    });
  });
});
