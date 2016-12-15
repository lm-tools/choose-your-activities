const UnsortedActivitiesPage = function UnsortedActivitiesPage(browser) {
  this.browser = browser;

  this.activityList = () => browser.queryAll('[data-test="activity"]').map(x =>
    ({
      title: x.innerHTML,
      url: x.href,
    })
  );
  this.visit = (accountId) => this.browser.visit(`/${accountId}/activities/unsorted`);
  this.browserPath = () => browser.location.pathname;
};

module.exports = UnsortedActivitiesPage;
