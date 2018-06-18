module.exports = class ChosenActivitiesViewModel {

  constructor(categories) {
    this.categories = categories;
    this.currentCategory = this.categories.find(category => category.isSelectedCategory);
    const currentCategoryIndex = this.categories.indexOf(this.currentCategory);
    let nextCategoryIndex = currentCategoryIndex;
    while (++nextCategoryIndex <= this.categories.length) {
      this.nextCategory = this.categories[nextCategoryIndex];
      if (this.nextCategory && this.nextCategory.hasActivities) {
        break;
      }
    }
    let previousCategoryIndex = currentCategoryIndex;
    while (--previousCategoryIndex >= 0) {
      this.previousCategory = this.categories[previousCategoryIndex];
      if (this.previousCategory && this.previousCategory.hasActivities) {
        break;
      }
    }
  }
};
