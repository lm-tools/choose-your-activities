const CategoryView = require('./category-view-model');
const activityDecorator = require('../locales/activity-decorator');

module.exports = class SmartAnswersViewModel {
  constructor(groupedActivities = []) {
    const categoryView = new CategoryView();
    this.categoryGroups = categoryView.categories
      .filter(category => !!groupedActivities[category.name])
      .map(category =>
        ({
          categoryTitle: category.title,
          categoryName: category.name,
          sortedActivities: groupedActivities[category.name]
            .map(activityDecorator)
            .map(activity => ({
              activityTitle: activity.title, activityName: activity.activity,
            })),
        }));
    this.hasCategorisedActivities = this.categoryGroups.length > 0;
  }
};
