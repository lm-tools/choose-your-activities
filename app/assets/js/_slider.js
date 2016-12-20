module.exports = class Slider {
  constructor($el) {
    this.$el = $el;
  }

  slide() {
    this.$el.animate({ left: '120%' }, 1000);
    this.$el.slideUp();
  }
};
