class ActivityGroupDetailsPage {

  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visit(version, accountId, groupId) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/details`
    );
  }

  getTitle() {
    return this.browser.text('title');
  }


  getHeading() {
    const headingText = this.browser.text('h2');
    const subHeadingText = this.browser.text('h2 .heading-secondary');
    return { headingText: headingText.replace(subHeadingText, '').trim(), subHeadingText };
  }

}

module.exports = ActivityGroupDetailsPage;
