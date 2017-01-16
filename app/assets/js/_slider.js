module.exports = class Slider {
  constructor($el) {
    this.$el = $el;
    this.$el.click((e) => e.preventDefault());
  }

  slide() {
    this.$el.animate({ left: $(window).width() }, 1000);
    this.$el.slideUp();
  }
};
