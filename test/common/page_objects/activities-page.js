const ActivityPage = function ActivityPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  function activityModel(x, selector) {
    const query = browser.query(selector, x);
    return {
      title: query.innerHTML,
      href: query.href,
    };
  }

  this.unCategorisedActivitiesCount = () => browser.text('[data-test="remaining"]');
  this.unCategorisedActivitiesList = () => browser.queryAll('[data-test-activity]')
    .map(x => activityModel(x, '[class="menu-item-medium"]'));
  this.categorisedActivitiesList = () => browser.queryAll('[class~="menu-container-small"]')
    .map(x => ({
      title: browser.query('[data-test="title"]', x).innerHTML,
      href: browser.query('[data-test="link"] a', x).href,
    }));
  this.isActivityUnderCategoryDisplayed = (category, activity) =>
    !!this.browser.query(`[data-test="${category}"] + ul > li > div > [data-test="${activity}"]`);
  this.visit = (version, accountId, group) =>
    this.browser.visit(`${basePath}/${version}/${accountId}/groups/${group}/activities`);
  this.browserPath = () => browser.location.pathname;
  this.backButtonDisplayed = () => !!this.browser.query('[class="link-back"]');
  this.clickStartAgain = () => this.browser.pressButton('Start again');
};

module.exports = ActivityPage;
