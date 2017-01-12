module.exports = class Slider {
  constructor($el) {
    this.$el = $el;
    this.$el.click((e) => e.preventDefault());
  }

  slide() {
    this.$el.animate({ left: '200%' }, 1000);
    this.$el.slideUp();
  }
};
