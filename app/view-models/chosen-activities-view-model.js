module.exports = class ChosenActivitiesViewModel {

  constructor(categories) {
    this.categories = categories;
    this.currentCategory = this.categories.find(category => category.isSelectedCategory);
    const currentCategoryIndex = this.categories.indexOf(this.currentCategory);
    let nextCategoryIndex = currentCategoryIndex;
    while (++nextCategoryIndex <= this.categories.length) {
      const nextCategoryCandidate = this.categories[nextCategoryIndex];
      if (nextCategoryCandidate && nextCategoryCandidate.hasActivities) {
        this.nextCategory = nextCategoryCandidate;
        break;
      }
    }
    let previousCategoryIndex = currentCategoryIndex;
    while (--previousCategoryIndex >= 0) {
      const previousCategoryCandidate = this.categories[previousCategoryIndex];
      if (previousCategoryCandidate && previousCategoryCandidate.hasActivities) {
        this.previousCategory = previousCategoryCandidate;
        break;
      }
    }
  }
};
