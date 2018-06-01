const ActivityPage = function ActivityPage(browser, basePath) {
  this.browser = browser;
  this.basePath = basePath;

  function activityModel(x) {
    const query = browser.query('[class="menu-item"]', x);
    return {
      title: query.innerHTML,
      href: query.href,
    };
  }

  this.actvitiesCount = () => browser.text('[data-test="remaining"]');
  this.actvitiesList = () => browser.queryAll('[data-test-activity]').map(activityModel);
  this.visit = (version, accountId, group) =>
    this.browser.visit(`${basePath}/${version}/${accountId}/groups/${group}/activities`);
  this.browserPath = () => browser.location.pathname;
  this.backButtonDisplayed = () => !!this.browser.query('[class="link-back"]');
};

module.exports = ActivityPage;
