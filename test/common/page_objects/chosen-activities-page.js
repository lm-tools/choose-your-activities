const extractActivityCountFromContents = (contentsText) => {
  const capture = /^.*\(([0-9]) activit.*\)$/.exec(contentsText);

  if (!capture) throw new Error('Failed to regex capture activity count');

  return Number(capture[1]);
};

class ChosenActivitiesPage {

  constructor(browser, basePath) {
    this.browser = browser;
    this.basePath = basePath;
  }

  visitWithCategory(version, accountId, groupId, category) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen?cat=${category}`
    );
  }

  visit(version, accountId, groupId) {
    return this.browser.visit(
      `${this.basePath}/${version}/${accountId}/groups/${groupId}/activities/chosen`
    );
  }

  getTitle() {
    return this.browser.text('title');
  }

  getHeading() {
    const headingText = this.browser.text('div h1.heading-xlarge');
    const subHeadingText = this.browser.text('div h2.heading-secondary');
    return { headingText: headingText.replace(subHeadingText, '').trim(), subHeadingText };
  }

  getCategoryHeading() {
    return this.browser.text('[data-test=category-heading]');
  }

  getTextForListItemNumber(number) {
    const categoryContentsArray =
      Array.from(this.browser.querySelectorAll('li.app-c-contents-list__list-item'));
    const selectedCategoryListItem = categoryContentsArray[number];
    const childNodes = selectedCategoryListItem.childNodes;
    const text = childNodes[0].textContent;
    return text.replace(' ', '').trim();
  }

  getChangeLinks() {
    return Array.from(this.browser.querySelectorAll('.chosen-activities-heading a'))
      .filter(link => this.browser.text(link) === 'Change');
  }

  getCategoryContents() {
    const contents = [];

    const currentCategoryText = this.browser.text('li.app-c-contents-list__list-item--active');
    contents.push({
      text: currentCategoryText,
      isLink: false,
      activityCount: extractActivityCountFromContents(currentCategoryText),
    });

    const otherCategories = this.browser.querySelectorAll('a.app-c-contents-list__link');

    Array.from(otherCategories).forEach(category => {
      const text = this.browser.text(category);
      contents.push({
        text,
        isLink: true,
        activityCount: extractActivityCountFromContents(text),
      });
    });

    return contents;
  }

  clickContentsLinkForCategory(category) {
    return this.browser.clickLink(`a.app-c-contents-list__link[href="?cat=${category}"]`);
  }

  backButtonDisplayed() {
    return !!this.browser.query('[class="link-back"]');
  }

  printPageButtonDisplayed() {
    return !!this.browser.query('[class~="print-link__link"]');
  }

  getMoreActivities() {
    return this.browser.queryAll('[data-test|="group-link"]')
      .map(x => ({ title: x.innerHTML, href: x.href }));
  }

  clickLinkForGroup(group) {
    return this.browser.click(`[data-test="group-link-${group}"]`);
  }

  clickChangeLinkForActivityWithHeading(activityHeading) {
    const headingDiv = Array.from(this.browser.querySelectorAll('.chosen-activities-heading'))
      .find(heading => this.browser.text('h3', heading) === activityHeading);

    const changeLink = this.browser.query('a', headingDiv);

    return this.browser.clickLink(changeLink);
  }

  browserPath() {
    return this.browser.location.pathname;
  }

  hasPreviousLink() {
    return !!this.browser.query('[data-test="previous"]');
  }

  getPreviousLink() {
    const query = this.browser.query('[data-test="previous"]');
    return ({ title: query.innerHTML, href: query.href });
  }

  clickPrevious() {
    return this.browser.click('[data-test="previous"]');
  }

  hasNextLink() {
    return !!this.browser.query('[data-test="next"]');
  }

  getNextLink() {
    const query = this.browser.query('[data-test="next"]');
    return ({ title: query.innerHTML, href: query.href });
  }

  clickNext() {
    return this.browser.click('[data-test="next"]');
  }

  getAnchorLink() {
    const anchor = this.browser.query('div.back-to-top a');
    return { title: this.browser.text(anchor), href: anchor.getAttribute('href') };
  }
}

module.exports = ChosenActivitiesPage;
