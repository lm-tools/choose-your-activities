const SortedActivitiesBasePage = require('./sorted-activities-base-page');
const expect = require('chai').expect;

class SortedActivitiesPage extends SortedActivitiesBasePage {

  visit(version, accountId) {
    return this.browser.visit(`${this.basePath}/${version}/${accountId}/activities/sorted`);
  }

  clickReSortActivitiesLink() {
    return this.browser.click('[data-test="action-on-view"]');
  }

  expectAt(version, accountId) {
    expect(this.browserPath()).to
      .equal(`${this.basePath}/${version}/${accountId}/activities/sorted`);
  }

}

module.exports = SortedActivitiesPage;
